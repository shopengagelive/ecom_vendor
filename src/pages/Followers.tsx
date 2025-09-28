import React, { useState } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { mockFollowers } from "../data/mockData";
import { Follower } from "../types";
import {
  Calendar,
  Mail,
  Users,
  Phone,
  MapPin,
  ShoppingBag,
  Package,
} from "lucide-react";

export default function Followers() {
  const [selectedFollower, setSelectedFollower] = useState<Follower | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleFollowerClick = (follower: Follower) => {
    setSelectedFollower(follower);
    setModalOpen(true);
  };

  const totalFollowers = mockFollowers.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Followers</h1>
        <p className="text-gray-600">
          Manage your store followers and customer base.
        </p>
      </div>

      {/* Total Followers Stats */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Total Followers
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {totalFollowers}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Active followers</p>
            <p className="text-sm text-green-600 font-medium">
              +{Math.floor(totalFollowers * 0.2)} this month
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Store Followers
          </h3>
          <p className="text-sm text-gray-600">
            View and manage your store's followers and subscribers.
          </p>
        </div>

        {mockFollowers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No followers yet
            </h3>
            <p className="text-gray-500">
              You have no followers at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follower ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockFollowers.map((follower) => (
                  <tr
                    key={follower.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleFollowerClick(follower)}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={follower.profilePic}
                        alt={follower.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium hover:text-blue-600">
                      {follower.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-1 text-gray-400" />
                      {follower.email}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-700 bg-gray-100 rounded">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(follower.followDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info" className="rounded-full">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        {follower.storeOrdersCount}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="success" className="rounded-full">
                        <Package className="w-3 h-3 mr-1" />
                        {follower.totalOrdersCount}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-700 bg-gray-100 rounded">
                      {follower.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Follower Details Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Follower Details"
        size="md"
      >
        {selectedFollower && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <img
                src={selectedFollower.profilePic}
                alt={selectedFollower.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedFollower.name}
                </h3>
                <p className="text-gray-600">{selectedFollower.email}</p>
                <p className="text-sm text-gray-500">
                  Following since{" "}
                  {new Date(selectedFollower.followDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-700">
                    {selectedFollower.email}
                  </span>
                </div>
                {selectedFollower.mobileNumber && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-700">
                      {selectedFollower.mobileNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            {selectedFollower.address && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address
                </h4>
                <div className="space-y-1 text-gray-700">
                  <p>{selectedFollower.address.street}</p>
                  <p>
                    {selectedFollower.address.city},{" "}
                    {selectedFollower.address.state}
                  </p>
                  <p>
                    {selectedFollower.address.zipCode},{" "}
                    {selectedFollower.address.country}
                  </p>
                </div>
              </div>
            )}

            {/* Order Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Store Orders</p>
                    <p className="text-xl font-bold text-blue-600">
                      {selectedFollower.storeOrdersCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedFollower.totalOrdersCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
