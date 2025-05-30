"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Home, Building, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock address data
const mockAddresses = [
  {
    id: 1,
    type: "home",
    isDefault: true,
    name: "John Doe",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    type: "work",
    isDefault: false,
    name: "John Doe",
    street: "456 Business Ave, Suite 200",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    country: "United States",
    phone: "+1 (555) 987-6543",
  },
]

export default function Addresses() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [addresses, setAddresses] = useState(mockAddresses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<any>(null)
  const [formData, setFormData] = useState({
    id: 0,
    type: "home",
    isDefault: false,
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
  }

  const handleAddAddress = () => {
    const newAddress = {
      ...formData,
      id: addresses.length + 1,
    }

    // If this is set as default, update other addresses
    let updatedAddresses = [...addresses]
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }))
    }

    setAddresses([...updatedAddresses, newAddress])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: t.common.success,
      description: "Address has been added successfully.",
    })
  }

  const handleEditAddress = () => {
    const updatedAddresses = addresses.map((addr) => {
      if (addr.id === formData.id) {
        return formData
      }
      // If current address is set as default, remove default from others
      if (formData.isDefault && addr.id !== formData.id) {
        return { ...addr, isDefault: false }
      }
      return addr
    })

    setAddresses(updatedAddresses)
    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: t.common.success,
      description: "Address has been updated successfully.",
    })
  }

  const handleDeleteAddress = (id: number) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== id)
    setAddresses(updatedAddresses)

    toast({
      title: t.common.success,
      description: "Address has been deleted successfully.",
    })
  }

  const editAddress = (address: any) => {
    setCurrentAddress(address)
    setFormData(address)
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      id: 0,
      type: "home",
      isDefault: false,
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
    })
    setCurrentAddress(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{t.auth.addresses}</h2>
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {address.type === "home" ? <Home className="w-4 h-4 mr-2" /> : <Building className="w-4 h-4 mr-2" />}
                  <CardTitle className="text-lg capitalize">{address.type}</CardTitle>
                </div>
                {address.isDefault && (
                  <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{address.name}</p>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
                <p className="pt-1">{address.phone}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => editAddress(address)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDeleteAddress(address.id)}
                disabled={address.isDefault}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
          <div className="p-3 mb-4 rounded-full bg-slate-100">
            <MapPin className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="mb-1 text-lg font-medium">No addresses found</h3>
          <p className="mb-4 text-sm text-slate-500">Add a shipping or billing address to your account</p>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Address Type</Label>
              <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex items-center">
                    <Home className="w-4 h-4 mr-2" /> Home
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="work" />
                  <Label htmlFor="work" className="flex items-center">
                    <Building className="w-4 h-4 mr-2" /> Work
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="street">Street Address</Label>
              <Textarea id="street" name="street" value={formData.street} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP/Postal Code</Label>
                <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={handleDefaultChange}
                className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
              />
              <Label htmlFor="isDefault">Set as default address</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAddress}>Save Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Address Type</Label>
              <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="edit-home" />
                  <Label htmlFor="edit-home" className="flex items-center">
                    <Home className="w-4 h-4 mr-2" /> Home
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="edit-work" />
                  <Label htmlFor="edit-work" className="flex items-center">
                    <Building className="w-4 h-4 mr-2" /> Work
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Same form fields as Add Dialog */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-street">Street Address</Label>
              <Textarea id="edit-street" name="street" value={formData.street} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-city">City</Label>
                <Input id="edit-city" name="city" value={formData.city} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-state">State/Province</Label>
                <Input id="edit-state" name="state" value={formData.state} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-zip">ZIP/Postal Code</Label>
                <Input id="edit-zip" name="zip" value={formData.zip} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input id="edit-country" name="country" value={formData.country} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input id="edit-phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isDefault"
                checked={formData.isDefault}
                onChange={handleDefaultChange}
                className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
                disabled={currentAddress?.isDefault}
              />
              <Label htmlFor="edit-isDefault">
                {currentAddress?.isDefault ? "This is your default address" : "Set as default address"}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAddress}>Update Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Fallback icon if import fails
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  )
}
