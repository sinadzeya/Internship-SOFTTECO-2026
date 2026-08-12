"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../store/store";

export default function Providers({ children, initialReduxState }) {
	const storeRef = useRef(null);

	if (!storeRef.current) {
		storeRef.current = makeStore(initialReduxState);
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}
