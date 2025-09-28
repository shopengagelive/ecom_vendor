import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { Upload, FileText } from "lucide-react";
import { KYCDocument } from "./types";
import Loader from "../shared/loader";
import { Link } from "react-router-dom";

interface VerificationTabProps {
  kycDocuments: KYCDocument[];
  predefinedDocumentTypes: string[];
  loading: boolean;
  handleDocTypeChange: any;
  documentForm: any;
  uploading: boolean;
  error: any;
  onKYCUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VerificationTab({
  kycDocuments,
  loading,
  predefinedDocumentTypes,
  handleDocTypeChange,
  documentForm,
  uploading,
  error,
  onKYCUpload,
}: VerificationTabProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">KYC Documents</h3>
        <p className="text-sm text-gray-600">
          Upload your KYC documents for verification.
        </p>
      </div>

      {
        loading ?
          <Loader />
          :
          <div className="space-y-4">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center mb-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-2 text-lg font-medium text-gray-900">
                  Upload KYC Document
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Document Type
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    defaultValue=""
                    value={documentForm.documentType}
                    onChange={handleDocTypeChange}
                  >
                    <option value="" disabled>
                      Select document type
                    </option>
                    {predefinedDocumentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Upload File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={onKYCUpload}
                    disabled={!documentForm.documentType || uploading}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent ${!documentForm.documentType ? "cursor-not-allowed bg-gray-100" : ""
                      }`}
                  />
                  {uploading && (
                    <p className="text-sm text-blue-500 mt-2">Uploading...</p>
                  )}
                  {error && (
                    <p className="text-sm text-red-500 mt-2">{error}</p>
                  )}
                  {documentForm.fileUrl && !uploading && (
                    <p className="text-sm text-green-600 mt-2">
                      File uploaded successfully ✔
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, JPG, JPEG, PNG
                </p>
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
              {kycDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <Link to={doc.fileUrl || '#'} target="_blank" className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      {/* <p className="font-medium text-gray-900">{doc.documentType}</p> */}
                      <p className="text-sm text-gray-500">{doc.documentType}</p>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(doc.status)}>
                      {doc.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
      }


    </Card>
  );
}
