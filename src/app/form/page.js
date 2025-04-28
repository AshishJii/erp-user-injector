'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ERPLogin from "@/components/ui/loginWithERP";

export default function FormPage() {
  const [formData, setFormData] = useState({
    busTime: "",
    busStop: "",
    busNo: "",
    seatPreference: "",
    otherDetails: "",
    proxyToken: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // handle actual submission logic here
    // alert(JSON.stringify(formData));
    setSubmitting(true);
    setTimeout(() => {setSubmitting(false)}, 400);
    setFormData({
      busTime: "",
      busStop: "",
      busNo: "",
      seatPreference: "",
      otherDetails: "",
      proxyToken: '',
    })
  };

  const handleProxyToken = (token) => {
    console.log("package grabbed",token);
    setFormData(prev => ({ ...prev, proxyToken: token }));
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Bus Details Collection Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <ERPLogin handleProxyToken={handleProxyToken} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="proxyToken">Proxy Token</Label>
              <Input
                id="proxyToken"
                name="proxyToken"
                value={formData.proxyToken || '--Sign-in--'}
                readOnly
                className="bg-gray-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="busTime">What time do you catch the bus?</Label>
              <Input
                id="busTime"
                name="busTime"
                type="time"
                value={formData.busTime}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="busStop">What is your bus stop?</Label>
              <Input
                id="busStop"
                name="busStop"
                placeholder="Enter bus stop"
                value={formData.busStop}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="busNo">What is your bus number?</Label>
              <Input
                id="busNo"
                name="busNo"
                placeholder="Enter bus number"
                value={formData.busNo}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="seatPreference">Do you have a seat preference?</Label>
              <div className="flex items-center gap-3">
                <div>
                  <input
                    id="seatPreferenceYes"
                    type="radio"
                    name="seatPreference"
                    value="Yes"
                    checked={formData.seatPreference === "Yes"}
                    onChange={handleChange}
                  />
                  <Label htmlFor="seatPreferenceYes">Yes</Label>
                </div>
                <div>
                  <input
                    id="seatPreferenceNo"
                    type="radio"
                    name="seatPreference"
                    value="No"
                    checked={formData.seatPreference === "No"}
                    onChange={handleChange}
                  />
                  <Label htmlFor="seatPreferenceNo">No</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="otherDetails">Any other relevant details?</Label>
              <Input
                id="otherDetails"
                name="otherDetails"
                placeholder="Enter any additional details"
                value={formData.otherDetails}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              {submitting ? 'Processing...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
