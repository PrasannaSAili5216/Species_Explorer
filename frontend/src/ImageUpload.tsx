import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, CircularProgress, Box, Paper, LinearProgress, Switch, FormControlLabel } from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import { Pets } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from './AuthContext';

interface Prediction {
    label: string;
    probability: number;
}

const MAX_DISCOVERIES = 5;

const ImageUpload: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<Prediction[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [detectionType, setDetectionType] = useState<'organism' | 'microbe'>('organism');
    const [discoveryCount, setDiscoveryCount] = useState<number>(0);
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!auth?.token) {
            const storedDiscoveryCount = localStorage.getItem('discoveryCount');
            if (storedDiscoveryCount) {
                setDiscoveryCount(parseInt(storedDiscoveryCount, 10));
            }
        }
    }, [auth?.token]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (!auth?.token && discoveryCount >= MAX_DISCOVERIES) {
            setError(`You have made ${MAX_DISCOVERIES} discoveries. Ask a grown-up to sign up to make more!`);
            return;
        }
        if (acceptedFiles && acceptedFiles[0]) {
            const file = acceptedFiles[0];
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setPrediction(null);
            setError(null);
        }
    }, [auth?.token, discoveryCount]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, disabled: !auth?.token && discoveryCount >= MAX_DISCOVERIES });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!auth?.token && discoveryCount >= MAX_DISCOVERIES) {
            setError(`You have made ${MAX_DISCOVERIES} discoveries. Ask a grown-up to sign up to make more!`);
            return;
        }
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setPrediction(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!auth?.token && discoveryCount >= MAX_DISCOVERIES) {
            setError(`You have made ${MAX_DISCOVERIES} discoveries. Ask a grown-up to sign up to make more!`);
            return;
        }

        if (!selectedImage) {
            setError("Please pick a picture first!");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedImage);

        const endpoint = detectionType === 'organism' ? 'http://127.0.0.1:8000/predict' : 'http://127.0.0.1:8000/predict_microbe';

        try {
            const headers: HeadersInit = {};
            if (auth?.token) {
                headers['Authorization'] = `Bearer ${auth.token}`;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError("Please log in to make a prediction.");
                } else {
                    throw new Error('Something went wrong, maybe the grown-ups need to check the server!');
                }
                return;
            }

            const data = await response.json();
            setPrediction(data.prediction);
            setError(null); // Clear any previous errors on success
            if (!auth?.token) {
                try {
                    const newDiscoveryCount = discoveryCount + 1;
                    setDiscoveryCount(newDiscoveryCount);
                    localStorage.setItem('discoveryCount', newDiscoveryCount.toString());
                } catch (e) {
                    console.error("Failed to update discovery count in localStorage", e);
                }
            }

        } catch (err) {
            console.error("Error during upload:", err);
            setError("Something went wrong, maybe the grown-ups need to check the server!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const listener = (event: Event) => {
            if (!auth?.token && discoveryCount >= MAX_DISCOVERIES) {
                setError(`You have made ${MAX_DISCOVERIES} discoveries. Ask a grown-up to sign up to make more!`);
                return;
            }
            const clipboardEvent = event as ClipboardEvent;
            const items = clipboardEvent.clipboardData?.items;
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        const file = items[i].getAsFile();
                        if (file) {
                            setSelectedImage(file);
                            setPreviewImage(URL.createObjectURL(file));
                            setPrediction(null);
                            setError(null);
                        }
                        break;
                    }
                }
            }
        };
        window.addEventListener('paste', listener);
        return () => {
            window.removeEventListener('paste', listener);
        };
    }, [auth?.token, discoveryCount]);


    return (
        <Card>
            <CardContent>
                {!auth?.token && discoveryCount >= MAX_DISCOVERIES && (
                    <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                        You've made {MAX_DISCOVERIES} discoveries! Ask a grown-up to sign up to make more.
                    </Typography>
                )}
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <FormControlLabel
                                control={<Switch checked={detectionType === 'microbe'} onChange={() => setDetectionType(detectionType === 'organism' ? 'microbe' : 'organism')} />}
                                label={detectionType === 'organism' ? "Big Critters" : "Tiny Critters"}
                                disabled={!auth?.token && discoveryCount >= MAX_DISCOVERIES}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Paper
                            {...getRootProps()}
                            sx={{
                                border: `4px dashed ${isDragActive ? '#ffeb3b' : '#90caf9'}`,
                                textAlign: 'center',
                                cursor: !auth?.token && discoveryCount >= MAX_DISCOVERIES ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: !auth?.token && discoveryCount >= MAX_DISCOVERIES ? 0.5 : 1,
                                minHeight: 300
                            }}
                        >
                            <input {...getInputProps()} />
                            {previewImage ? (
                                <CardMedia
                                    component="img"
                                    image={previewImage}
                                    alt="Preview"
                                    sx={{ objectFit: 'contain', maxHeight: 300 }}
                                />
                            ) : (
                                <Box sx={{backgroundColor: '#fffde7', padding: 2, borderRadius: 4, display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Pets sx={{ fontSize: 80, color: '#90caf9',}} />
                                    <Typography sx={{mt: 2, fontWeight: 'bold'}}>Drop a picture of an animal here!</Typography>
                                    <Typography variant="body2" color="text.secondary">Or click to pick one.</Typography>
                                </Box>
                            )}
                        </Paper>
                        <Box mt={2} textAlign="center">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleUpload}
                                disabled={!selectedImage || loading || (!auth?.token && discoveryCount >= MAX_DISCOVERIES)}
                                sx={{fontSize: '1.2rem', fontWeight: 'bold'}}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Discover!'}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        {loading && <LinearProgress color="secondary" />}
                        
                        <Typography variant="h6">What did you find?</Typography>
                        {prediction && (
                            <Box>
                                <List>
                                    {prediction.map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={item.label.replace(/_/g, ' ')}
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box sx={{ width: '100%', mr: 1 }}>
                                                            <LinearProgress variant="determinate" value={item.probability * 100} color="secondary" />
                                                        </Box>
                                                        <Box sx={{ minWidth: 35 }}>
                                                            <Typography variant="body2" color="text.secondary">{`${(item.probability * 100).toFixed(0)}% sure!`}</Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ImageUpload;