import React from "react";
import { Outlet } from "react-router-dom";

const OutletWrapper = ({ event }) => {
	return <Outlet context={{ event }} />;
};

export default OutletWrapper;
