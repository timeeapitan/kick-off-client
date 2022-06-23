import MyAppBar from "./MyAppBar";

const MainLayout = ({ children }) => {
  return (
    <div style={{ width: "100%", position: "fixed" }}>
      <MyAppBar />
      <div style={{ overflowY: "scroll", height: "100vh" }}>{children}</div>
    </div>
  );
};

export default MainLayout;
