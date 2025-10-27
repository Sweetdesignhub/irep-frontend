
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Result, Button } from 'antd';
import Loading from '../components/common/Loading';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState({
        loading: true,
        success: false,
        message: ''
    });

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (!token) {
                    setVerificationStatus({
                        loading: false,
                        success: false,
                        message: 'Verification token is missing.'
                    });
                    return;
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`
                );

                if (response.data.success) {
                    setVerificationStatus({
                        loading: false,
                        success: true,
                        message: 'Email verified successfully!'
                    });
                    toast.success('Email verified successfully!');

                } else {
                    setVerificationStatus({
                        loading: false,
                        success: false,
                        message: response.data.error || 'Email verification failed.'
                    });
                }
            } catch (err) {
                console.error('Verification error:', err);
                const errorMessage = err.response?.data?.error || 'Error occurred while verifying email.';
                setVerificationStatus({
                    loading: false,
                    success: false,
                    message: errorMessage
                });
                toast.error(errorMessage);
            }
        };

        verifyEmail();
    }, [location.search]);

    const handleRedirectToSignIn = () => {
        navigate('/sign-in');
    };

    if (verificationStatus.loading) {
        return <Loading />
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Result
                status={verificationStatus.success ? 'success' : 'error'}
                title={verificationStatus.success ? 'Email Verified' : 'Verification Failed'}
                subTitle={verificationStatus.message}
                extra={
                    verificationStatus.success ? (
                        <Button type="primary" onClick={handleRedirectToSignIn}>
                            Go to Sign In
                        </Button>
                    ) : null
                }
            />
        </div>
    );
};

export default VerifyEmail;