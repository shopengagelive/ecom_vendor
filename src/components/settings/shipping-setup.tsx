import { Menu as HeadlessMenu } from "@headlessui/react";
import Card from '../ui/Card'
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

const ShippingSetup = ({shippingMode, onShippingModeChange, onNavigateToShippingSetup, Settings}:any) => {
    return (
        <div>
            <Card>
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Shipping Setup</h3>
                        <p className="text-sm text-gray-600">Configure courier companies and tracking settings.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <HeadlessMenu as="div" className="relative">
                            <HeadlessMenu.Button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <span>Shipping Mode: {shippingMode === "manual" ? "Self" : "Marketplace"}</span>
                                <ChevronDown className="w-4 h-4" />
                            </HeadlessMenu.Button>
                            <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none z-10">
                                <div className="py-1">
                                    <HeadlessMenu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => onShippingModeChange("manual")}
                                                className={`${active ? "bg-gray-100" : ""} ${shippingMode === "manual" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                                                    } flex w-full items-center justify-between px-4 py-2 text-sm whitespace-nowrap`}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">Self</span>
                                                    <span className="text-xs text-gray-500">Manage your own shipping</span>
                                                </div>
                                                {shippingMode === "manual" && <Check className="w-4 h-4 text-blue-600" />}
                                            </button>
                                        )}
                                    </HeadlessMenu.Item>
                                    <HeadlessMenu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => onShippingModeChange("automatic")}
                                                className={`${active ? "bg-gray-100" : ""} ${shippingMode === "automatic" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                                                    } flex w-full items-center justify-between px-4 py-2 text-sm whitespace-nowrap`}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">Marketplace</span>
                                                    <span className="text-xs text-gray-500">Use marketplace shipping</span>
                                                </div>
                                                {shippingMode === "automatic" && <Check className="w-4 h-4 text-blue-600" />}
                                            </button>
                                        )}
                                    </HeadlessMenu.Item>
                                </div>
                            </HeadlessMenu.Items>
                        </HeadlessMenu>
                        <Button onClick={onNavigateToShippingSetup} icon={Settings} variant="primary">
                            Shipping Setup
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ShippingSetup
