"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, CheckCircle2, AlertCircle } from "lucide-react";

const COUNTRIES = [
  { name: "Afghanistan", code: "93", iso: "AF" },
  { name: "Australia", code: "61", iso: "AU" },
  { name: "Bangladesh", code: "880", iso: "BD" },
  { name: "Canada", code: "1", iso: "CA" },
  { name: "China", code: "86", iso: "CN" },
  { name: "Egypt", code: "20", iso: "EG" },
  { name: "France", code: "33", iso: "FR" },
  { name: "Germany", code: "49", iso: "DE" },
  { name: "India", code: "91", iso: "IN" },
  { name: "Indonesia", code: "62", iso: "ID" },
  { name: "Iran", code: "98", iso: "IR" },
  { name: "Iraq", code: "964", iso: "IQ" },
  { name: "Italy", code: "39", iso: "IT" },
  { name: "Japan", code: "81", iso: "JP" },
  { name: "Jordan", code: "962", iso: "JO" },
  { name: "Kuwait", code: "965", iso: "KW" },
  { name: "Malaysia", code: "60", iso: "MY" },
  { name: "Nepal", code: "977", iso: "NP" },
  { name: "Nigeria", code: "234", iso: "NG" },
  { name: "Oman", code: "968", iso: "OM" },
  { name: "Pakistan", code: "92", iso: "PK" },
  { name: "Philippines", code: "63", iso: "PH" },
  { name: "Qatar", code: "974", iso: "QA" },
  { name: "Saudi Arabia", code: "966", iso: "SA" },
  { name: "Singapore", code: "65", iso: "SG" },
  { name: "South Africa", code: "27", iso: "ZA" },
  { name: "South Korea", code: "82", iso: "KR" },
  { name: "Sri Lanka", code: "94", iso: "LK" },
  { name: "Turkey", code: "90", iso: "TR" },
  { name: "United Arab Emirates", code: "971", iso: "AE" },
  { name: "United Kingdom", code: "44", iso: "GB" },
  { name: "United States", code: "1", iso: "US" },
].sort((a, b) => a.name.localeCompare(b.name));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Which fields are required
const REQUIRED_FIELDS = ["email", "firstName", "lastName", "country", "streetAddress", "city", "phone"];

function fieldBorder(state) {
  // state: "error" | "done" | "idle"
  if (state === "error") return "border-red-400 focus-within:border-red-500 focus-within:ring-red-200";
  if (state === "done")  return "border-emerald-300 focus-within:border-emerald-400 focus-within:ring-emerald-200";
  return "border-slate-200 focus-within:border-primary focus-within:ring-primary";
}

function FieldIcon({ state }) {
  if (state === "done")
    return <CheckCircle2 size={18} strokeWidth={2.5} className="pointer-events-none shrink-0 text-emerald-500" />;
  if (state === "error")
    return <AlertCircle size={18} strokeWidth={2.5} className="pointer-events-none shrink-0 text-red-400" />;
  return null;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function getState(isDone, isError) {
  if (isError) return "error";
  if (isDone) return "done";
  return "idle";
}

function TickInput({
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  isDone,
  isError,
  errorMsg,
  disabled = false,
}) {
  const state = getState(isDone, isError);
  return (
    <div>
      <div
        className={`flex w-full items-center rounded-lg border px-4 transition focus-within:ring-1 ${fieldBorder(
          state
        )} ${disabled ? "bg-slate-100" : "bg-white"}`}
      >
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={disabled}
          className={`w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 ${
            disabled ? "cursor-not-allowed text-slate-500" : ""
          }`}
        />
        <span className="ml-2"><FieldIcon state={state} /></span>
      </div>
      <FieldError message={isError ? errorMsg : ""} />
    </div>
  );
}

function CountrySelect({ value, onSelect, isDone, isError }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const state = getState(isDone, isError);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left text-sm outline-none transition focus:ring-1 ${fieldBorder(state)}`}
      >
        <span className={value ? "text-ink" : "text-slate-400"}>
          {value || "Select country / region *"}
        </span>
        <span className="flex items-center gap-2">
          <FieldIcon state={state} />
          <ChevronDown size={14} className="text-slate-400" />
        </span>
      </button>

      {isError && !isOpen && (
        <p className="mt-1 text-xs text-red-500">Please select your country</p>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country"
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-slate-400">No matches found.</p>
            ) : (
              filtered.map((country) => (
                <button
                  key={country.iso}
                  type="button"
                  onClick={() => { onSelect(country); setIsOpen(false); setSearch(""); }}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-bg-secondary ${
                    country.name === value ? "bg-bg-secondary text-primary" : "text-ink"
                  }`}
                >
                  <span>{country.name}</span>
                  <span className="text-slate-400">+{country.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneInput({ countryCode, phoneNumber, onCountryCodeChange, onPhoneNumberChange, isDone, isError }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const state = getState(isDone, isError);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountry =
    COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES.find((c) => c.iso === "PK");

  const filtered = COUNTRIES.filter((c) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return c.name.toLowerCase().includes(term) || c.code.includes(term.replace("+", ""));
  });

  return (
    <div ref={wrapperRef} className="relative">
      <div className={`flex w-full items-center rounded-lg border bg-white transition focus-within:ring-1 ${fieldBorder(state)}`}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 rounded-l-lg border-r border-slate-200 px-3 py-3 text-sm text-ink transition hover:bg-slate-50"
        >
          <span className="font-medium">+{selectedCountry.code}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        <input
          type="tel"
          inputMode="numeric"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value.replace(/\D/g, ""))}
          placeholder="Phone number *"
          required
          className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
        />

        <span className="mr-3"><FieldIcon state={state} /></span>
      </div>

      {isError && (
        <p className="mt-1 text-xs text-red-500">Please enter a valid phone number</p>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code"
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-slate-400">No matches found.</p>
            ) : (
              filtered.map((country) => (
                <button
                  key={`${country.iso}-${country.code}`}
                  type="button"
                  onClick={() => { onCountryCodeChange(country.code); setIsOpen(false); setSearch(""); }}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-bg-secondary ${
                    country.code === selectedCountry.code && country.iso === selectedCountry.iso
                      ? "bg-bg-secondary text-primary"
                      : "text-ink"
                  }`}
                >
                  <span>{country.name}</span>
                  <span className="text-slate-400">+{country.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillingForm({ form, onChange, submitAttempted, isLoggedIn = false }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Email is locked to the logged-in user's account email and cannot be edited here.
    if (name === "email" && isLoggedIn) return;
    onChange({ ...form, [name]: value });
  };

  const handleCountrySelect = (country) => {
    onChange({ ...form, country: country.name, phoneCountryCode: country.code });
  };

  const done = {
    email: EMAIL_RE.test(form.email || ""),
    firstName: !!form.firstName?.trim(),
    lastName: !!form.lastName?.trim(),
    companyName: !!form.companyName?.trim(),
    country: !!form.country?.trim(),
    streetAddress: !!form.streetAddress?.trim(),
    apartment: !!form.apartment?.trim(),
    city: !!form.city?.trim(),
    state: !!form.state?.trim(),
    pinCode: !!form.pinCode?.trim(),
    phone: (form.phoneNumber || "").replace(/\D/g, "").length >= 6,
    notes: !!form.notes?.trim(),
  };

  // Only show errors after user tried to submit
  const err = (field) => submitAttempted && !done[field];

  return (
    <div className="space-y-8">
      {/* Customer info */}
      <div>
        <h2 className="mb-3 text-xl font-bold text-ink">Customer information</h2>
        <TickInput
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email address *"
          required
          isDone={done.email}
          isError={err("email")}
          errorMsg="Please enter a valid email address"
          disabled={isLoggedIn}
        />
        {isLoggedIn && (
          <p className="mt-1 text-xs text-slate-400">
            This is the email linked to your account and can't be changed here.
          </p>
        )}
      </div>

      {/* Billing details */}
      <div>
        <h2 className="mb-3 text-xl font-bold text-ink">Billing details</h2>
        <div className="space-y-4">

          <div className="grid gap-4 sm:grid-cols-2">
            <TickInput
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name *"
              required
              isDone={done.firstName}
              isError={err("firstName")}
              errorMsg="First name is required"
            />
            <TickInput
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name *"
              required
              isDone={done.lastName}
              isError={err("lastName")}
              errorMsg="Last name is required"
            />
          </div>

          <TickInput
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Company name"
            isDone={done.companyName}
            isError={false}
          />

          <CountrySelect
            value={form.country}
            onSelect={handleCountrySelect}
            isDone={done.country}
            isError={err("country")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TickInput
              name="streetAddress"
              value={form.streetAddress}
              onChange={handleChange}
              placeholder="House number and street name *"
              required
              isDone={done.streetAddress}
              isError={err("streetAddress")}
              errorMsg="Street address is required"
            />
            <TickInput
              name="apartment"
              value={form.apartment}
              onChange={handleChange}
              placeholder="Apartment, suite, unit, etc."
              isDone={done.apartment}
              isError={false}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <TickInput
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Town / City *"
              required
              isDone={done.city}
              isError={err("city")}
              errorMsg="City is required"
            />
            <TickInput
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State / Province"
              isDone={done.state}
              isError={false}
            />
            <TickInput
              name="pinCode"
              value={form.pinCode}
              onChange={handleChange}
              placeholder="ZIP / Postal code"
              isDone={done.pinCode}
              isError={false}
            />
          </div>

          <PhoneInput
            countryCode={form.phoneCountryCode || "92"}
            phoneNumber={form.phoneNumber || ""}
            onCountryCodeChange={(code) => onChange({ ...form, phoneCountryCode: code })}
            onPhoneNumberChange={(digits) => onChange({ ...form, phoneNumber: digits })}
            isDone={done.phone}
            isError={err("phone")}
          />
        </div>
      </div>

      {/* Additional info */}
      <div>
        <h2 className="mb-3 text-xl font-bold text-ink">Additional information</h2>
        <div className={`flex items-start rounded-lg border bg-white px-4 transition focus-within:ring-1 ${fieldBorder(done.notes ? "done" : "idle")}`}>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Notes about your order, e.g. special notes for delivery."
            className="w-full resize-none bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
          />
          {done.notes && (
            <CheckCircle2 size={18} strokeWidth={2.5} className="mt-3 shrink-0 text-emerald-500" />
          )}
        </div>
      </div>
    </div>
  );
}