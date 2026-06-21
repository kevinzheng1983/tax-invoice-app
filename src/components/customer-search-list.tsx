"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/app-shell";
import type { CustomerDTO } from "@/lib/data";

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function customerDetails(customer: CustomerDTO) {
  const contact = customer.email || customer.phone || "No contact details";
  return customer.insuranceCompany ? `${customer.insuranceCompany} · ${contact}` : contact;
}

export function CustomerSearchList({ customers }: { customers: CustomerDTO[] }) {
  const [query, setQuery] = useState("");
  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("en-AU");
    if (!normalizedQuery) return customers;
    return customers.filter((customer) =>
      customer.name.toLocaleLowerCase("en-AU").includes(normalizedQuery),
    );
  }, [customers, query]);

  return <section className="customer-search-section">
    <label className="search-box"><Icon name="search"/><input aria-label="Search customers by name" type="search" placeholder="Search by customer name" value={query} onChange={(event) => setQuery(event.target.value)}/></label>
    {filteredCustomers.length ? <div className="customer-list">{filteredCustomers.map((customer) => <div className="customer-card" key={customer.id}>
      <Link className="customer-card-main" href={`/customers/${customer.id}/edit`}>
        <span className="avatar">{initials(customer.name)}</span>
        <span className="customer-card-copy"><b>{customer.name}</b><small>{customerDetails(customer)}</small></span>
        <Icon name="chevron"/>
      </Link>
      <Link className="customer-invoice-button" href={`/invoices/new?customerId=${customer.id}`} aria-label={`Create invoice for ${customer.name}`}><Icon name="file"/><span>Invoice</span></Link>
    </div>)}</div> : <div className="compact-empty search-empty"><p>No matching customers</p><span>Try another customer name.</span></div>}
  </section>;
}
