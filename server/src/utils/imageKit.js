import imagekit from '../configs/imageKit/config.js';

const isImageKitConfigured = () => {
    const pub = process.env.IMAGEKIT_PUBLIC_KEY;
    const priv = process.env.IMAGEKIT_PRIVATE_KEY;
    const endpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    return (
        pub &&
        pub !== 'dummy_public_key' &&
        priv &&
        priv !== 'dummy_private_key' &&
        endpoint &&
        !endpoint.includes('dummy')
    );
};

const uploadToImageKit = async (fileBuffer, fileName, folder = '/') => {
    try {
        if (!fileBuffer) return null;

        // If ImageKit credentials are dummy or unconfigured, seamlessly fallback to Data URL
        if (!isImageKitConfigured()) {
            console.warn('ImageKit credentials are not configured or using dummy values. Falling back to base64 Data URL.');
            const ext = (fileName || '').split('.').pop()?.toLowerCase();
            const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
            return {
                url: `data:${mime};base64,${fileBuffer.toString('base64')}`,
                fileId: 'local_' + Date.now(),
            };
        }

        const base64File = fileBuffer.toString('base64');

        return new Promise((resolve) => {
            imagekit.upload(
                {
                    file: `data:application/octet-stream;base64,${base64File}`,
                    fileName: fileName,
                    folder: folder,
                },
                (error, result) => {
                    if (error) {
                        console.error('ImageKit Upload Error (falling back to base64):', error?.message || error);
                        const ext = (fileName || '').split('.').pop()?.toLowerCase();
                        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
                        return resolve({
                            url: `data:${mime};base64,${base64File}`,
                            fileId: 'local_' + Date.now(),
                        });
                    }
                    console.log('Successfully uploaded to ImageKit');
                    resolve(result);
                }
            );
        });
    } catch (error) {
        console.error('Error in uploadToImageKit:', error);
        if (fileBuffer) {
            return {
                url: `data:image/jpeg;base64,${fileBuffer.toString('base64')}`,
                fileId: 'local_' + Date.now(),
            };
        }
        return null;
    }
};

const deleteFromImageKit = async (fileId) => {
    try {
        if (!fileId || fileId.startsWith('local_')) return { result: 'skipped' };
        if (!isImageKitConfigured()) return { result: 'skipped' };

        return new Promise((resolve) => {
            imagekit.deleteFile(fileId, (error, result) => {
                if (error) {
                    console.warn('ImageKit Delete Warning (continuing):', error?.message || error);
                    return resolve({ error: error?.message || 'failed' });
                }
                console.log('Successfully deleted from ImageKit');
                resolve(result);
            });
        });
    } catch (error) {
        console.warn('Error in deleteFromImageKit:', error);
        return { error: error?.message };
    }
};

export { uploadToImageKit, deleteFromImageKit };