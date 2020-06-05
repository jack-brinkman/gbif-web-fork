import { useState, useEffect, useRef } from 'react';
import queryGraphQL from './queryGraphQL';

const RENEW_REQUEST = 'RENEW_REQUEST';

const useUnmounted = () => {
  const unmounted = useRef(false)
  useEffect(() => () => {
    unmounted.current = true
  }, [])
  return unmounted
}

function useQuery(query, options = {}) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // functions are called when passed to useState so it has to be wrapped. 
  // We provide an empty call, just so we do not have to check for existence subsequently
  const [cancelRequest, setCancel] = useState(() => () => {});
  const unmounted = useUnmounted()

  function init() {
    setData();
    setLoading(true);
    setError(false)
    cancelRequest(RENEW_REQUEST);
  }

  function load(options) {
    init();
    const variables = options.variables;
    const { promise: dataPromise, cancel } = queryGraphQL(query, { variables });
    // functions cannot be direct values in states as function are taken as a way to create derived states
    // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
    setCancel(() => cancel);
    dataPromise.
      then(response => {
        if (unmounted.current) return;
        const { data, error } = response;
        if (error?.isCanceled?.message === RENEW_REQUEST) {
          return;
        }
        setError(error);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        if (unmounted.current) return;
        setError({ error: true, type: 'unknown' });
        setData();
        setLoading(false);
      });
  }

  // Cancel pending request on unmount
  useEffect(() => () => {
    cancelRequest();
  }, [cancelRequest]);

  useEffect(() => {
    if (!options.lazyLoad) {
      load(options);
    }
    // we leave cleaning to a seperate useEffect cleanup step
  }, [
    query,
    options.lazyLoad,
    options.ignoreVariableUpdates ? void 0 : options.variables
  ]);

  return { data, loading, error, load, cancel: cancelRequest || (() => { }) };
}

export default useQuery;