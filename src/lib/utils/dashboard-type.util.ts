export const getDashboardType = (): "events" | "turves" => {
  const dashboardType = localStorage?.getItem("dashboardType");
  if (dashboardType === "events" || dashboardType === "turves") {
    return dashboardType;
  }
  return "events"; // default to "events" if not set or invalid
};

export const setDashboardType = (type: "events" | "turves") => {
  localStorage?.setItem("dashboardType", type);
};
