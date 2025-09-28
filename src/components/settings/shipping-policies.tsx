import React from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { CheckCircle, Edit, Plus, Trash2, XCircle } from 'lucide-react'

const ShippingPolicies = ({onOpenPolicyModal,shippingInfos, handleEditPolicy, handleDeletePolicy}:any) => {
    return (
        <Card>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
                    <p className="text-sm text-gray-600">Configure your shipping and refund policies.</p>
                </div>
                <Button onClick={onOpenPolicyModal} icon={Plus}>
                    Add
                </Button>
            </div>
            <div className="space-y-3">
                {shippingInfos.length === 0 ? (
                    <div className="text-sm text-gray-500">No shipping policies added yet</div>
                ) : (
                    shippingInfos.map((info:any) => (
                        <div
                            key={info.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{info.policy}</span>
                                <span className="inline-flex items-center gap-2 text-sm" aria-live="polite">
                                    <span className="text-sm">
                                        Status: <strong className="ml-1">{info.isCheck ? "Enabled" : "Disabled"}</strong>
                                    </span>
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full" aria-hidden="true">
                                        {info.isCheck ? (
                                            <CheckCircle className="w-4 text-green-700 h-4" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-700" />
                                        )}
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEditPolicy(info)}>
                                    {""}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={Trash2}
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleDeletePolicy(info.id)}
                                >
                                    {""}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    )
}

export default ShippingPolicies
