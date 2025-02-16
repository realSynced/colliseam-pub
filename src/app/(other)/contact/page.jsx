"use client";
import { useState } from "react";

export default function ContactPage() {
  async function handleOnSubmit(e) {
    e.preventDefault();
    const formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    fetch("/api/email", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log(formData);
  }
  return (
    <div className="h-svh flex flex-col justify-center items-center bg-[#e1eaf2] ">
      <div>
        <h1 className="font-bold text-3xl mb-12">Contact Us</h1>
      </div>

      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleOnSubmit}>
          <div className="rounded-lg px-8 py-6 max-w-md overflow-y-hidden">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="johndoe@example.com"
              className="mb-2 appearance-none border rounded-full w-full py-3 px-3 text-gray-700 leading-tight outline-none shadow-outline focus:border-slate-500"
            />

            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="johndoe@example.com"
              className="mb-2 appearance-none border rounded-full w-full py-3 px-3 text-gray-700 leading-tight outline-none shadow-outline focus:border-slate-500"
            />

            <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="johndoe@example.com"
              className="mb-2 appearance-none border rounded-full w-full py-3 px-3 text-gray-700 leading-tight outline-none shadow-outline focus:border-slate-500"
            />

            <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea
              type="text"
              name="message"
              className="resize-none w-full h-32 mb-2 appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-slate-500"
            ></textarea>
            <button
              type="submit"
              className="text-white font-bold mt-4 justify-center w-full rounded-full bg-primary transition-colors duration-100 ease-in-out hover:bg-primary  py-2 px-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
