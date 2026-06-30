import { useLocation } from "react-router-dom";

function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div className="page-transition" key={location.pathname}>
      {children}
    </div>
  );
}

export default PageTransition;
