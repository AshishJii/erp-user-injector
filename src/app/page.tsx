'use client';
import React from 'react';
import ERPLogin from "@/components/ui/loginWithERP";
import Link from 'next/link'

export default function ERPLoginPage() {
  
  return (
    <div className="flex min-h-screen justify-center">
      <ERPLogin handleProxyToken={(t: string)=>console.log(t)}/>
        <hr/>
      <Link href="/form">Sample Form&gt;&gt;&gt;</Link>
    </div>
  );
}