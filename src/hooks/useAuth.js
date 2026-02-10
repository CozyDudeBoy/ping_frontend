const useAuth = () => {
  return !!localStorage.getItem('token');
};

export default useAuth;
