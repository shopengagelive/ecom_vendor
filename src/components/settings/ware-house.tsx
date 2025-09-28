import React from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { Edit, Plus, Trash2 } from 'lucide-react'

const WareHouse = ({ openAddWarehouse, loadingWarehouses, warehouses, openEditWarehouse, handleDeleteWarehouse }:any) => {
    return (
        <div>
            <Card>
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Warehouses</h3>
                        <p className="text-sm text-gray-600">Manage your pickup/dispatch warehouse locations.</p>
                    </div>
                    <Button onClick={openAddWarehouse} icon={Plus}>
                        Add Warehouse
                    </Button>
                </div>
                {loadingWarehouses ? (
                    <div className="text-sm text-gray-500">Loading warehouses...</div>
                ) : (
                    <div className="space-y-3">
                        {warehouses.length === 0 ? (
                            <div className="text-sm text-gray-500">No warehouses added yet</div>
                        ) : (
                            warehouses.map((wh: any) => (
                                <div
                                    key={wh.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{wh.name}</span>
                                        <span className="text-sm text-gray-600">
                                            {wh.address}, {wh.city}, {wh.state} - {wh.postCode}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" icon={Edit} onClick={() => openEditWarehouse(wh)}>
                                            {""}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Trash2}
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleDeleteWarehouse(wh.id)}
                                        >
                                            {""}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}

export default WareHouse
