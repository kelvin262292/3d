"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import PersonalInfo from "./components/personal-info"
import Orders from "./components/orders"
import Addresses from "./components/addresses"
import ChangePassword from "./components/change-password"
import Notifications from "./components/notifications"
import AccountSidebar from "./components/account-sidebar"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function AccountPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("personal-info")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">{t.auth.personal_info}</h1>

      <div className="flex flex-col gap-6 md:flex-row">
        {!isMobile ? (
          <>
            <div className="w-full md:w-1/4">
              <AccountSidebar activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
            <div className="w-full md:w-3/4">
              <Card className="p-6">
                {activeTab === "personal-info" && <PersonalInfo />}
                {activeTab === "orders" && <Orders />}
                {activeTab === "addresses" && <Addresses />}
                {activeTab === "change-password" && <ChangePassword />}
                {activeTab === "notifications" && <Notifications />}
              </Card>
            </div>
          </>
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="personal-info">{t.auth.personal_info}</TabsTrigger>
              <TabsTrigger value="orders">{t.auth.my_orders}</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>
            <TabsContent value="personal-info">
              <Card className="p-6">
                <PersonalInfo />
              </Card>
            </TabsContent>
            <TabsContent value="orders">
              <Card className="p-6">
                <Orders />
              </Card>
            </TabsContent>
            <TabsContent value="more">
              <Tabs defaultValue="addresses" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="addresses">{t.auth.addresses}</TabsTrigger>
                  <TabsTrigger value="change-password">{t.auth.change_password}</TabsTrigger>
                  <TabsTrigger value="notifications">{t.auth.notifications}</TabsTrigger>
                </TabsList>
                <TabsContent value="addresses">
                  <Card className="p-6">
                    <Addresses />
                  </Card>
                </TabsContent>
                <TabsContent value="change-password">
                  <Card className="p-6">
                    <ChangePassword />
                  </Card>
                </TabsContent>
                <TabsContent value="notifications">
                  <Card className="p-6">
                    <Notifications />
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
