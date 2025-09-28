import React from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { Edit, Globe, Package, Plus, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge'

const ShippingZoneComponent = ({ openAddZone, savingZone, loadingZones, zoneError, shippingZones, openEditZone, deletingZoneId, handleDeleteZone, onAddMethod, onEditMethod }: any) => {
    return (
        <div>
            <Card>
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Shipping Zones</h3>
                        <p className="text-sm text-gray-600">Create and manage shipping zones and methods.</p>
                    </div>
                    <Button onClick={openAddZone} icon={Plus} disabled={savingZone}>
                        Add Zone
                    </Button>
                </div>
                {loadingZones ? (
                    <div className="text-sm text-gray-500">Loading zones...</div>
                ) : zoneError ? (
                    <div className="text-sm text-red-600 mt-2">{zoneError}</div>
                ) : (
                    <div className="space-y-4">
                        {shippingZones.length === 0 ? (
                            <div className="text-sm text-gray-500">No shipping zones added yet</div>
                        ) : (
                            shippingZones.map((zone: any) => (
                                <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Globe className="w-5 h-5 text-blue-500" />
                                            <h4 className="font-semibold text-gray-900">{zone.zoneName}</h4>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={Edit}
                                                onClick={() => openEditZone(zone)}
                                                disabled={savingZone || deletingZoneId === zone.id}
                                            >
                                                {""}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={Trash2}
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeleteZone(zone.id)}
                                                disabled={savingZone || deletingZoneId === zone.id}
                                            >
                                                {""}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Countries</label>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {/* {(zone.countries || []).map((country:any, index:any) => ( */}
                                                <Badge variant="default" className="text-xs">
                                                    {zone.country}
                                                </Badge>
                                                {/* ))} */}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">States</label>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {(zone.state || []).map((state: any, index: any) => (
                                                    <Badge key={index} variant="default" className="text-xs">
                                                        {state}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Restricted PIN Codes</label>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {(zone.restrictedPin || []).map((pinCode: any, index: any) => (
                                                    <Badge key={index} variant="danger" className="text-xs">
                                                        {pinCode}
                                                    </Badge>
                                                ))}
                                                {(zone.restrictedPin || []).length === 0 && (
                                                    <span className="text-xs text-gray-500">No restrictions</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700">Shipping Methods</label>
                                            <Button
                                                size="sm"
                                                onClick={() => onAddMethod(zone)}
                                                icon={Plus}
                                                disabled={savingZone || deletingZoneId === zone.id}
                                            >
                                                Add Method
                                            </Button>
                                        </div>
                                        <div className="mt-2 space-y-2">
                                            {(zone.shippingMethod || []).map((method: any) => (
                                                <div
                                                    key={method.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium">{method.title}</span>
                                                        {method.method === "Free" && <Badge variant="success" className="text-xs">Free</Badge>}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="text-sm text-gray-600">₹{method.cost}</div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={Edit}
                                                            onClick={() => onEditMethod(zone, method)}
                                                            disabled={savingZone || deletingZoneId === zone.id}
                                                        >
                                                            {""}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(zone.shippingMethod || []).length === 0 && (
                                                <div className="text-center py-4 text-gray-500">No shipping methods added yet</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                {zoneError && <div className="text-sm text-red-600 mt-2">{zoneError}</div>}
            </Card>
        </div>
    )
}

export default ShippingZoneComponent
