import { AppShell, BottomNav, Icon } from "@/components/app-shell";

export default function SettingsPage() {
  return <AppShell bottom={<BottomNav active="settings" />}><header className="page-header"><h1>Settings</h1></header><section className="settings-card"><div className="settings-icon"><Icon name="settings"/></div><h2>Business details</h2><p>Your receipt identity and payment details are fixed in the A4 export.</p><dl><div><dt>Business</dt><dd>Zhaoyang Shi</dd></div><div><dt>ABN</dt><dd>86 164 178 873</dd></div><div><dt>Currency</dt><dd>AUD</dd></div></dl></section></AppShell>;
}
