import { AppShell, TopBar } from "@/components/app-shell";
import { CustomerForm } from "@/components/forms/customer-form";

export default function NewCustomerPage() {
  return <AppShell className="form-page"><TopBar title="Add customer" back="/customers"/><CustomerForm/></AppShell>;
}

