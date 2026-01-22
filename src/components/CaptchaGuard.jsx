import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CaptchaOverlay from './CaptchOverlay';
import Navbar from './Navbar';
import { setDeviceId } from '../redux/slices/captchaSlice.js';
import { getDevice } from '../utils/fingerPrint.js';
import PageLoader from './PageLoader';

const CaptchaGuard = ({ children }) => {
    const { captchaRequired, deviceId } = useSelector((s) => s.captcha);
    const dispatch = useDispatch();

    useEffect(() => {
        async function initFingerprint() {
            if (!deviceId) {
                const id = await getDevice();
                dispatch(setDeviceId(id));
            }
        }
        initFingerprint();
    }, [dispatch, deviceId]);

    // 1. If captcha is triggered, show overlay
    if (captchaRequired) {
        return (
            <>
                <Navbar />
                <CaptchaOverlay />
            </>
        );
    }

    // 2. Wait for Device ID to be ready before loading the app
    // This prevents requests from going out without identification
    if (!deviceId) {
        return <PageLoader subtitle="Initializing secure connection..." />;
    }

    return children;
}

export default CaptchaGuard;
