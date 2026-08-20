import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      if (result?.success) {
        setData(result.data);
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        return result.data;
      } else {
        throw new Error(result?.message || 'Operation failed');
      }
    } catch (err) {
      setError(err.message);
      if (!options.silent) {
        toast.error(err.message || 'Something went wrong');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  const reset = () => {
    setData(options.initialData || null);
    setError(null);
  };

  return { data, loading, error, execute, reset, setData };
};

export const useLazyApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const load = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      if (result?.success) {
        setData(result.data);
        setFetched(true);
        return result.data;
      }
      throw new Error(result?.message || 'Failed');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, load, fetched, setData };
};
