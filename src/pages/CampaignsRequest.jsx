import React, { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadFileToFirebase, deleteFileByUrl } from '../utils/firebaseStorage';
import { 
  FaUser, FaPhone, FaProcedures, FaCalendarAlt, FaStethoscope, 
  FaMoneyBillWave, FaMapMarkerAlt, FaFileUpload, FaUniversity, 
  FaArrowRight, FaArrowLeft, FaCheckCircle, FaTrash, FaPlus, FaTimes, FaSpinner
} from 'react-icons/fa';

const CampaignsRequest = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [uploading, setUploading] = useState({}); 
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        patientName: '',
        age: '',
        disease: '',
        amount: '',
        address: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
    });

    // Dynamic Documents State
    const [documents, setDocuments] = useState([
        { id: 1, name: '', files: [] },
    ]);

    // Fetch details if ID exists
    React.useEffect(() => {
        if (id) {
            setIsEditMode(true);
            const fetchRequest = async () => {
                setLoading(true);
                try {
                    const res = await api.get(`/campaign-requests/${id}`);
                    if (res.data.success) {
                        const data = res.data.data;
                        
                        setFormData({
                            name: data.name || '',
                            number: data.number || '',
                            patientName: data.patientName || '',
                            age: data.age || '',
                            disease: data.disease || '',
                            amount: data.amount || '',
                            address: data.address || '',
                            bankName: data.bankName || '',
                            accountNumber: data.accountNumber || '',
                            ifscCode: data.ifscCode || '',
                            accountHolderName: data.accountHolderName || ''
                        });

                        if (data.documents && data.documents.length > 0) {
                            const formattedDocs = data.documents.map((doc, idx) => ({
                                id: idx + 1,
                                name: doc.documentName,
                                files: doc.documentUrl.map(url => ({
                                    name: url.split('/').pop().split('?')[0] || 'File', 
                                    url: url
                                }))
                            }));
                            setDocuments(formattedDocs);
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch request", err);
                    toast.error("Failed to load details");
                    navigate('/dashboard');
                } finally {
                    setLoading(false);
                }
            };
            fetchRequest();
        }
    }, [id, navigate]);


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Add new document row
    const addDocumentRow = () => {
        const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
        setDocuments([...documents, { id: newId, name: '', files: [] }]);
    };

    // Remove document row
    const removeDocumentRow = async (id) => {
        const docToRemove = documents.find(d => d.id === id);
        if (docToRemove && docToRemove.files.length > 0) {
            // Optional: Auto-delete files when removing row? 
            // User asked for "cut karne pr firebase se bhi remove ho jati hai".
            // Implementation: Yes, cleanup files.
            const confirm = window.confirm('Removing this row will delete uploaded files. Continue?');
            if (!confirm) return;

            for (const file of docToRemove.files) {
                try {
                    await deleteFileByUrl(file.url);
                } catch (err) {
                    console.error('Failed to delete file', err);
                }
            }
            toast.info(`Removed ${docToRemove.files.length} file(s) from cloud.`);
        }
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    // Handle document name change
    const handleDocumentNameChange = (id, newName) => {
        setDocuments(documents.map(doc => 
            doc.id === id ? { ...doc, name: newName } : doc
        ));
    };

    // Handle file selection and IMMEDIATE UPLOAD
    const handleFileChange = async (id, e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        // Set uploading state
        setUploading(prev => ({ ...prev, [id]: true }));

        const uploadedFiles = [];

        try {
            for (const file of selectedFiles) {
                // Determine folder based on doc type roughly or just 'campaign_documents'
                const toastId = toast.loading(`Uploading ${file.name}...`);
                try {
                    const result = await uploadFileToFirebase(file, 'campaign_documents');
                    
                    toast.update(toastId, { render: `${file.name} uploaded!`, type: "success", isLoading: false, autoClose: 2000 });
                    
                    uploadedFiles.push({
                        name: file.name,
                        url: result.url
                    });
                } catch (err) {
                    toast.update(toastId, { render: `Failed to upload ${file.name}`, type: "error", isLoading: false, autoClose: 3000 });
                    console.error(err);
                }
            }

            // Update state with new URLs
            setDocuments(documents.map(doc => 
                doc.id === id ? { ...doc, files: [...doc.files, ...uploadedFiles] } : doc
            ));

        } catch (error) {
            console.error("Batch upload error", error);
        } finally {
            setUploading(prev => ({ ...prev, [id]: false }));
            // Reset input
            e.target.value = ''; 
        }
    };

    // Remove single file (and delete from Firebase)
    const removeFile = async (docId, fileIndex) => {
        const doc = documents.find(d => d.id === docId);
        if (!doc) return;
        
        const fileToRemove = doc.files[fileIndex];
        
        try {
            const toastId = toast.loading("Removing file...");
            await deleteFileByUrl(fileToRemove.url);
            toast.update(toastId, { render: "File removed from cloud", type: "info", isLoading: false, autoClose: 2000 });
            
            setDocuments(documents.map(d => {
                if (d.id === docId) {
                    const newFiles = [...d.files];
                    newFiles.splice(fileIndex, 1);
                    return { ...d, files: newFiles };
                }
                return d;
            }));
        } catch (error) {
            toast.error("Failed to remove file from cloud");
            console.error(error);
        }
    };

    const validateStep1 = () => {
        const { name, number, patientName, age, disease } = formData;
        if (!name || !number || !patientName || !age || !disease) {
            toast.error('Please fill all fields in Step 1');
            return false;
        }
        if (number.length !== 10) {
            toast.error('Mobile number should be 10 digits');
            return false;
        }
        return true;
    };


    const validateStep2 = () => {
        const { amount, address, bankName, accountNumber, ifscCode, accountHolderName } = formData;
        if (!amount || !address || !bankName || !accountNumber || !ifscCode || !accountHolderName) {
            toast.error('Please fill all fields in Step 2');
            return false;
        }
        
        // Validate Documents
        if (documents.length === 0) {
             toast.error('Please add at least one document section');
             return false;
        }
        for (let doc of documents) {
            if (!doc.name.trim()) {
                toast.error('Please provide a name for all documents');
                return false;
            }
            if (doc.files.length === 0) {
                toast.error(`Please upload at least one file for ${doc.name}`);
                return false;
            }
        }
        
        // Check if anything is still uploading
        if (Object.values(uploading).some(val => val)) {
            toast.warning("Please wait for file uploads to complete");
            return false;
        }

        if (!termsAccepted) {
            toast.error('Please accept the Terms and Conditions to proceed.');
            return false;
        }

        return true;
    };

    const nextStep = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setStep(1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setLoading(true);

        const documentsPayload = documents.map(doc => ({
            documentName: doc.name,
            documentUrl: doc.files.map(f => f.url)
        }));

        const payload = {
            ...formData,
            documents: documentsPayload
        };
        
        try {
            if (isEditMode) {
                await api.put(`/campaign-requests/${id}`, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success('Campaign request updated successfully!');
            } else {
                await api.post('/campaign-requests', payload, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success('Campaign request submitted successfully!');
            }
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                        Campaign Request
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Raise a request for medical or social assistance. We are here to help.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= 1 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
                            1
                        </div>
                        <div className={`w-24 h-1 bg-muted mx-2 ${step >= 2 ? 'bg-primary' : ''}`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= 2 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
                            2
                        </div>
                    </div>
                    <div className="flex justify-center mt-2 text-sm font-medium text-muted-foreground gap-20">
                        <span className={step >= 1 ? 'text-primary' : ''}>Personal Details</span>
                        <span className={step >= 2 ? 'text-primary' : ''}>Documents & Bank</span>
                    </div>
                </div>

                <div className="bg-card py-8 px-6 shadow rounded-lg sm:px-10 border border-border">
                    <form className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-xl font-semibold text-card-foreground border-b border-border pb-2">Applicant & Patient Information</h3>
                                
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {/* Applicant Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Applicant Name</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="text-muted-foreground" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full pl-10 sm:text-sm rounded-md py-3 shadow-sm transition-colors placeholder:text-muted-foreground/50"
                                                placeholder="Your Full Name"
                                            />
                                        </div>
                                    </div>

                                    {/* Applicant Mobile */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Mobile Number</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaPhone className="text-muted-foreground" />
                                            </div>
                                            <input
                                                type="text"
                                                name="number"
                                                maxLength="10"
                                                value={formData.number}
                                                onChange={handleInputChange}
                                                className="bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full pl-10 sm:text-sm rounded-md py-3 shadow-sm transition-colors placeholder:text-muted-foreground/50"
                                                placeholder="10-digit Mobile Number"
                                            />
                                        </div>
                                    </div>

                                    {/* Patient Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Patient Name</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaProcedures className="text-muted-foreground" />
                                            </div>
                                            <input
                                                type="text"
                                                name="patientName"
                                                value={formData.patientName}
                                                onChange={handleInputChange}
                                                className="bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full pl-10 sm:text-sm rounded-md py-3 shadow-sm transition-colors placeholder:text-muted-foreground/50"
                                                placeholder="Patient's Name"
                                            />
                                        </div>
                                    </div>

                                    {/* Patient Age */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Patient Age</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaCalendarAlt className="text-muted-foreground" />
                                            </div>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                className="bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full pl-10 sm:text-sm rounded-md py-3 shadow-sm transition-colors placeholder:text-muted-foreground/50"
                                                placeholder="Age"
                                            />
                                        </div>
                                    </div>

                                    {/* Disease/Reason */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-foreground">Disease / Reason for Request</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaStethoscope className="text-muted-foreground" />
                                            </div>
                                            <input
                                                type="text"
                                                name="disease"
                                                value={formData.disease}
                                                onChange={handleInputChange}
                                                className="bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full pl-10 sm:text-sm rounded-md py-3 shadow-sm transition-colors placeholder:text-muted-foreground/50"
                                                placeholder="e.g. Cancer Treatment, Heart Surgery, etc."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-5">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                                    >
                                        Next Step <FaArrowRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-xl font-semibold text-card-foreground border-b border-border pb-2">Financial & Documents Needed</h3>
                                
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Amount Required (₹)</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaMoneyBillWave className="text-muted-foreground" />
                                            </div>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                className="bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full pl-10 sm:text-sm rounded-md py-3 shadow-sm transition-colors placeholder:text-muted-foreground/50"
                                                placeholder="e.g. 500000"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Address</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaMapMarkerAlt className="text-muted-foreground" />
                                            </div>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full pl-10 sm:text-sm rounded-md py-3 shadow-sm transition-colors placeholder:text-muted-foreground/50"
                                                placeholder="Full Address"
                                            />
                                        </div>
                                    </div>

                                    {/* HEAD: Bank Details */}
                                    <div className="sm:col-span-2 pt-4">
                                        <h4 className="text-md font-medium text-card-foreground flex items-center">
                                            <FaUniversity className="mr-2 text-primary" /> Bank Account Details
                                        </h4>
                                    </div>

                                    {/* Bank Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Bank Name</label>
                                        <input
                                            type="text"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleInputChange}
                                            className="mt-1 bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full shadow-sm sm:text-sm rounded-md py-3 transition-colors"
                                        />
                                    </div>

                                    {/* Account Holder */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Account Holder Name</label>
                                        <input
                                            type="text"
                                            name="accountHolderName"
                                            value={formData.accountHolderName}
                                            onChange={handleInputChange}
                                            className="mt-1 bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full shadow-sm sm:text-sm rounded-md py-3 transition-colors"
                                        />
                                    </div>

                                    {/* Account Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Account Number</label>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleInputChange}
                                            className="mt-1 bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full shadow-sm sm:text-sm rounded-md py-3 transition-colors"
                                        />
                                    </div>

                                    {/* IFSC */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">IFSC Code</label>
                                        <input
                                            type="text"
                                            name="ifscCode"
                                            value={formData.ifscCode}
                                            onChange={handleInputChange}
                                            className="mt-1 bg-background text-foreground border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary block w-full shadow-sm sm:text-sm rounded-md py-3 transition-colors"
                                        />
                                    </div>

                                    {/* HEAD: Documents */}
                                    <div className="sm:col-span-2 pt-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-md font-medium text-card-foreground flex items-center">
                                                <FaFileUpload className="mr-2 text-primary" /> Documents
                                            </h4>
                                            <button 
                                                type="button" 
                                                onClick={addDocumentRow}
                                                className="text-sm flex items-center text-primary hover:text-primary/90"
                                            >
                                                <FaPlus className="mr-1" /> Add Document
                                            </button>
                                        </div>
                                        
                                        <div className="mt-3 bg-muted/50 p-4 rounded-md text-sm text-muted-foreground space-y-2 border border-border/50">
                                            <p className="font-medium text-foreground">Please ensure you upload valid documents:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-1">
                                                <li>Upload <strong>Identity Proof</strong> (e.g., Aadhaar Card, PAN Card of the patient).</li>
                                                <li>Attach <strong>Medical Records</strong> like Hospital Bills or Doctor's Reports for verification.</li>
                                                <li>Clear photos or scanned PDFs are recommended for faster approval.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Dynamic Documents List */}
                                    <div className="sm:col-span-2 space-y-4">
                                        {documents.map((doc, index) => (
                                            <div key={doc.id} className="p-4 border border-input rounded-lg bg-background relative transition-all hover:border-primary/50">
                                                {/* Delete Button */}
                                                {documents.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeDocumentRow(doc.id)}
                                                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                                                        title="Remove this document entry"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Document Name */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">Document Name</label>
                                                        <input 
                                                            type="text" 
                                                            value={doc.name}
                                                            onChange={(e) => handleDocumentNameChange(doc.id, e.target.value)}
                                                            placeholder="e.g. Aadhaar Card / Hospital Bill"
                                                            className="w-full bg-background text-foreground border border-input rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary placeholder:text-muted-foreground/50"
                                                        />
                                                    </div>

                                                    {/* File Upload */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">Upload File(s)</label>
                                                        <div className="flex items-center space-x-2">
                                                            <label className={`cursor-pointer bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-md text-sm border border-input transition-colors ${uploading[doc.id] ? 'opacity-50 cursor-wait' : ''}`}>
                                                                <span className="flex items-center group">
                                                                     {uploading[doc.id] && <FaSpinner className="animate-spin mr-2" />} 
                                                                     {uploading[doc.id] ? 'Uploading...' : 'Choose Files'}
                                                                </span>
                                                                <input 
                                                                    type="file" 
                                                                    multiple 
                                                                    className="hidden" 
                                                                    onChange={(e) => handleFileChange(doc.id, e)}
                                                                    disabled={uploading[doc.id]}
                                                                    accept="image/*,application/pdf"
                                                                />
                                                            </label>
                                                            <span className="text-xs text-muted-foreground">
                                                                {doc.files.length > 0 ? `${doc.files.length} file(s) uploaded` : 'No file chosen'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Selected Files List with Previews */}
                                                {doc.files.length > 0 && (
                                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                        {doc.files.map((file, fIndex) => (
                                                            <div key={fIndex} className="relative group bg-card border border-border rounded-md overflow-hidden animate-fadeIn h-24 flex items-center justify-center">
                                                                {/* Thumbnail Preview */}
                                                                {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                                    <img 
                                                                        src={file.url} 
                                                                        alt={file.name}
                                                                        className="w-full h-full object-cover" 
                                                                    />
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center text-muted-foreground p-2 text-center">
                                                                        <FaFileUpload className="text-2xl mb-1 text-primary/50" />
                                                                        <span className="text-[10px] line-clamp-2 break-all leading-tight">{file.name}</span>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Overlay with details and remove button */}
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                                                    <span className="text-[10px] text-white text-center break-all mb-2 line-clamp-2 px-1">
                                                                        {file.name}
                                                                    </span>
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => removeFile(doc.id, fIndex)}
                                                                        className="text-white hover:text-red-400 focus:outline-none transform hover:scale-110 transition-transform"
                                                                        title="Remove File"
                                                                    >
                                                                        <FaTrash size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom Add Document Button */}
                                    <div className="flex justify-center sm:justify-end pt-2">
                                        <button 
                                            type="button" 
                                            onClick={addDocumentRow}
                                            className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                        >
                                            <FaPlus className="mr-2" /> Add Another Document
                                        </button>
                                    </div>
                                </div>

                                {/* Terms and Conditions Section */}
                                <div className="mt-8 bg-muted/30 p-4 rounded-lg border border-border/60">
                                    <div className="flex items-start gap-3">
                                        <input 
                                            type="checkbox" 
                                            id="terms" 
                                            checked={termsAccepted} 
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="mt-1 h-6 w-6 rounded border-input text-primary focus:ring-primary cursor-pointer accent-primary"
                                        />
                                        <div className="text-sm">
                                            <label htmlFor="terms" className="font-medium text-foreground cursor-pointer select-none">
                                                I agree to the <span className="text-primary hover:underline">Terms and Conditions</span> of United Global Federation.
                                            </label>
                                            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                                                By submitting this request, I acknowledge and agree that <span className="font-semibold text-foreground">United Global Federation</span> will charge a <span className="font-bold text-red-500">5% service fee</span> on the total funds raised. This amount will be utilized as a donation towards the NGO to support its administrative and operational activities.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-5">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="inline-flex items-center px-6 py-3 border border-input shadow-sm text-base font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        <FaArrowLeft className="mr-2" /> Previous
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading || Object.values(uploading).some(Boolean) || !termsAccepted}
                                        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading || Object.values(uploading).some(Boolean) || !termsAccepted ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Request'} { !loading && <FaCheckCircle className="ml-2" /> }
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CampaignsRequest;
