import React from "react";
import { withLeaflet } from "react-leaflet";
import VectorGridDefault from "react-leaflet-vectorgrid";

const VectorGrid = withLeaflet(VectorGridDefault);

export default props => <VectorGrid {...props} />;
