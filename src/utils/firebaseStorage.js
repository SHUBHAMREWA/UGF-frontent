import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgQ-qbDt3VTf2JranhgRzysbfFK8yCwHA",
  authDomain: "ugfngo-2c4c7.firebaseapp.com",
  projectId: "ugfngo-2c4c7",
  storageBucket: "ugfngo-2c4c7.firebasestorage.app",
  messagingSenderId: "425350615536",
  appId: "1:425350615536:web:c352c806c90f9c17648d35",
  measurementId: "G-1EFQQ223VZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Upload file to Firebase Storage
 * @param {File} file - File object to upload
 * @param {String} folder - Folder path in Firebase Storage (e.g., 'applications', 'donations')
 * @param {String} fileName - Optional custom file name
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadFileToFirebase = async (file, folder = 'uploads', fileName = null) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate file name
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const finalFileName = fileName || `${baseName}_${timestamp}.${ext}`;
    const filePath = `${folder}/${finalFileName}`;

    // Create storage reference
    const storageRef = ref(storage, filePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    // Get download URL
    const url = await getDownloadURL(snapshot.ref);

    return {
      url: url,
      path: filePath,
      fileName: finalFileName
    };
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    throw new Error(`Failed to upload file to Firebase: ${error.message}`);
  }
};

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {String} folder - Folder path in Firebase Storage
 * @returns {Promise<string>} - Returns the public URL
 */
export const uploadImageToFirebase = async (file, folder = 'images') => {
  const result = await uploadFileToFirebase(file, folder);
  return result.url;
};

/**
 * Upload PDF to Firebase Storage
 * @param {File} file - PDF file to upload
 * @param {String} folder - Folder path in Firebase Storage
 * @returns {Promise<string>} - Returns the public URL
 */
export const uploadPDFToFirebase = async (file, folder = 'documents') => {
  const result = await uploadFileToFirebase(file, folder);
  return result.url;
};

/**
 * Delete file from Firebase Storage
 * @param {String} filePath - Path to file in Firebase Storage
 * @returns {Promise<void>}
 */
export const deleteFileFromFirebase = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    console.log(`File deleted from Firebase: ${filePath}`);
  } catch (error) {
    console.error('Error deleting file from Firebase:', error);
    // Don't throw error, just log it (file might not exist)
  }
};

/**
 * Delete file by URL
 * @param {String} url - Public URL of the file
 * @returns {Promise<void>}
 */
export const deleteFileByUrl = async (url) => {
  try {
    // Extract path from URL
    // URL format: https://firebasestorage.googleapis.com/v0/b/bucket-name/o/path%2Fto%2Ffile?alt=media
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
    if (!pathMatch) {
      throw new Error('Invalid Firebase Storage URL');
    }
    const filePath = decodeURIComponent(pathMatch[1]);
    await deleteFileFromFirebase(filePath);
  } catch (error) {
    console.error('Error deleting file by URL:', error);
  }
};

const firebaseStorage = {
  uploadFileToFirebase,
  uploadImageToFirebase,
  uploadPDFToFirebase,
  deleteFileFromFirebase,
  deleteFileByUrl
};

export default firebaseStorage;

