import { redirect } from "next/navigation";
/** Hidden for now (PI assistant / paid plans are off: everyone is on the free plan). Delete this file to switch the section back on. */
export default function Hidden(): never { redirect("/settings"); }
