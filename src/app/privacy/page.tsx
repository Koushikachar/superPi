import { pageMeta } from "@/lib/seo"; import Legal, { H, H3, UL, OL, DT, Mail } from "@/components/Legal"; import { LEGAL } from "@/lib/legal";
export const metadata = pageMeta({ title: "Privacy policy", description: "How Superpi, operated by Direct2Hub Private Limited, collects, uses, stores, protects and shares information, and how to exercise your privacy rights.", path: "/privacy" });
const TOC: [string, string][] = [["intro", "1. Introduction"], ["collect", "2. Information we collect"], ["use", "3. How we use information"], ["storage", "4. Storage of business data"], ["sharing", "5. Information sharing"], ["security", "6. Data security"], ["ownership", "7. Data ownership"], ["retention", "8. Data retention"], ["rights", "9. Your privacy rights"], ["deletion", "10. Account deletion"], ["cookies", "11. Cookies"], ["children", "12. Children's privacy"], ["links", "13. Third-party links"], ["changes", "14. Changes"], ["contact", "15. Contact & grievances"], ["law", "16. Applicable law"]];
export default function Privacy() {
  return <Legal title="Privacy policy" path="/privacy" toc={TOC}>
    <H id="intro">1. Introduction</H>
    <p>Welcome to Superpi.</p>
    <p>Superpi (&quot;Superpi&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is an inventory management and AI-powered business software platform founded and operated by {LEGAL.company}, an Indian registered company.</p>
    <p>Website: <a href={LEGAL.website} className="text-brand underline">{LEGAL.website}</a></p>
    <p>We respect your privacy and recognize the importance of protecting personal information and business data.</p>
    <p>This Privacy Policy explains how information is collected, used, processed, stored, protected, and disclosed when you access or use the Superpi website, application, Business AI Assistant, and related services (collectively, the &quot;Services&quot;).</p>
    <p>By using Superpi, you acknowledge this Privacy Policy. Where consent is required by applicable law, we will seek it separately.</p>

    <H id="collect">2. Information We Collect</H>
    <H3>2.1 Account Information</H3>
    <p>When you create or use a Superpi account, we may collect:</p>
    <UL items={["Full name", "Email address", "Business or organization name, where provided", "Authentication and account identification information", "Account preferences", "Other information voluntarily provided during registration or account management"]} />
    <H3>2.2 Login and Authentication Information</H3>
    <p>Superpi supports email-and-password authentication and Google sign-in.</p>
    <p>For email-and-password accounts, authentication information is processed to verify account access.</p>
    <p>When users choose Google sign-in, we may receive relevant account identification information, such as a name, email address, and account identifier, depending on the permissions granted and the authentication configuration.</p>
    <p>Google authentication is also subject to Google&apos;s applicable privacy practices.</p>
    <p>Superpi does not require users to disclose their Google account passwords to Superpi.</p>
    <H3>2.3 Business and Inventory Information</H3>
    <p>When using Superpi, users may provide business information including:</p>
    <UL items={["Product names and descriptions", "Product categories and SKUs", "Product prices and inventory values", "Stock quantities", "Inventory adjustments and associated records", "Other information entered into inventory-related features"]} />
    <p>This information is used to provide the requested inventory management functionality.</p>
    <H3>2.4 Business AI Assistant Information</H3>
    <p>When you use the Business AI Assistant, Superpi may process:</p>
    <UL items={["Questions and prompts submitted to the assistant", "Relevant inventory and dashboard data from your account", "AI-generated responses", "Technical records associated with AI requests"]} />
    <p>Superpi uses an external AI technology provider to support the Business AI Assistant.</p>
    <p>Information necessary to answer your requests may be transmitted to and processed by that provider, subject to the provider&apos;s technical arrangements and applicable data protection requirements.</p>
    <p>Although Superpi&apos;s primary application database is hosted in India, AI-related processing may involve systems operated by an external provider.</p>
    <p>Data location, retention, and processing arrangements for external AI services may differ from those of Superpi&apos;s primary database.</p>
    <p>Users should avoid entering unnecessary personal, highly sensitive, or confidential third-party information into AI prompts.</p>
    <H3>2.5 Technical and Usage Information</H3>
    <p>When you access the Services, certain technical information may be processed, including:</p>
    <UL items={["IP address", "Browser and device information", "Operating system information", "Login and session information", "Access dates and times", "Error reports", "Security logs", "Application performance information"]} />
    <p>We use this information where necessary to operate, secure, maintain, and improve the Services.</p>
    <H3>2.6 Communications</H3>
    <p>When you email us or request support, we may collect the contact information and message content necessary to respond to your inquiry.</p>

    <H id="use">3. How We Use Your Information</H>
    <p>We may use information to:</p>
    <OL items={["Create and maintain user accounts.", "Authenticate users securely.", "Provide inventory management services.", "Process inventory and product information.", "Operate the Business AI Assistant.", "Display account-specific business information.", "Provide technical and customer support.", "Detect and prevent fraudulent or unauthorized activity.", "Maintain and improve system performance.", "Communicate important service and security updates.", "Comply with applicable legal obligations.", "Perform other purposes disclosed to users and permitted by law."]} />
    <p>We will use personal information only for purposes permitted by applicable law and obtain consent where required.</p>

    <H id="storage">4. Storage of Business Data</H>
    <p>Superpi&apos;s primary application data storage is located in India.</p>
    <p>This includes the primary database infrastructure used to maintain information associated with the inventory management platform.</p>
    <p>However, external services used for authentication, AI processing, infrastructure operations, or support may process information through their own systems.</p>
    <p>We do not represent that every category of data processed in connection with Superpi remains exclusively within India.</p>
    <p>Any applicable cross-border processing must comply with relevant legal requirements.</p>

    <H id="sharing">5. Information Sharing</H>
    <p>We may disclose information to authorized third parties where reasonably necessary to provide the Services or comply with applicable law.</p>
    <p>Such parties may include:</p>
    <DT t="Cloud and Infrastructure Providers">To host and maintain the application and its supporting infrastructure.</DT>
    <DT t="AI Technology Providers">To process relevant prompts and business information and generate responses through the Business AI Assistant.</DT>
    <DT t="Authentication Providers">To enable account access, including Google sign-in.</DT>
    <DT t="Technical Service Providers">To support platform maintenance, diagnostics, security, and operational functions.</DT>
    <DT t="Legal and Regulatory Authorities">Where disclosure is required or permitted by law.</DT>
    <DT t="Corporate Transaction Parties">Where information must be transferred as part of a lawful restructuring, merger, or acquisition, subject to applicable safeguards.</DT>
    <p>Superpi does not sell personal information to advertisers as part of its stated business model.</p>
    <p>We do not authorize service providers to use personal information for unrelated purposes unless separately permitted under applicable law.</p>

    <H id="security">6. Data Security</H>
    <p>We recognize the importance of protecting user information.</p>
    <p>We seek to maintain reasonable technical and organizational security safeguards suitable for the Services and the information processed.</p>
    <p>These may include authentication controls, access restrictions, secure connections, monitoring, and other appropriate safeguards implemented within our systems.</p>
    <p>However, no online platform can guarantee absolute security.</p>
    <p>Users should protect their login credentials, use appropriate account security practices, and report suspected unauthorized access to <Mail to={LEGAL.support} />.</p>

    <H id="ownership">7. Data Ownership and Control</H>
    <p>Users retain their rights in the business information and inventory records they submit to Superpi.</p>
    <p>Submitting information to Superpi does not transfer ownership of the underlying business data to {LEGAL.company}.</p>
    <p>We process this information to provide the Services, operate applicable features, maintain security, and meet other purposes described in this Privacy Policy.</p>
    <p>Users remain responsible for ensuring that they have the necessary authorization to submit and process their business data.</p>

    <H id="retention">8. Data Retention</H>
    <p>We retain information for as long as reasonably necessary to provide the Services, maintain accounts, fulfill disclosed processing purposes, and comply with legal obligations.</p>
    <p>Retention periods may depend on the type of information and the purpose of processing.</p>
    <p>When information is no longer required, we will handle deletion, anonymization, or secure disposal according to applicable legal and operational requirements.</p>
    <p>Certain records may be retained for legal compliance, security, fraud prevention, or dispute resolution.</p>
    <p>External technology providers may have separate processing and retention arrangements that apply to information processed through their systems.</p>

    <H id="rights">9. Your Privacy Rights</H>
    <p>Subject to applicable law, users may request:</p>
    <UL items={["Access to information about the processing of their personal data", "Correction of inaccurate personal information", "Updating of incomplete or outdated personal information", "Erasure of eligible personal information", "Withdrawal of consent where applicable", "Information about available grievance redressal procedures", "Other rights available under applicable privacy laws"]} />
    <p>Requests may require identity or account ownership verification.</p>
    <p>To submit a request, email <Mail to={LEGAL.support} />.</p>
    <p>We will respond in accordance with applicable legal requirements.</p>

    <H id="deletion">10. Account Deletion</H>
    <p>Users who wish to delete their Superpi account may send a request to <Mail to={LEGAL.support} /> from their registered email address.</p>
    <p>We may request additional verification before proceeding.</p>
    <p>Where deletion is applicable, associated information will be handled according to legal retention requirements and our technical procedures.</p>
    <p>Certain information may remain temporarily in backups or be retained where required by law.</p>
    <p>Users should preserve important inventory records before requesting account deletion.</p>

    <H id="cookies">11. Cookies and Similar Technologies</H>
    <p>Superpi may use cookies, local storage, and similar browser technologies to operate the website and application.</p>
    <p>These technologies may support:</p>
    <UL items={["User authentication", "Session management", "Account preferences", "Website functionality", "Security", "Performance monitoring"]} />
    <p>Where non-essential analytics or tracking technologies are implemented, we will provide applicable disclosures and consent options as required by law.</p>
    <p>Users may manage cookies through their browser settings. Restricting essential cookies may affect application functionality.</p>

    <H id="children">12. Children&apos;s Privacy</H>
    <p>Superpi is intended for business use and is not designed for independent use by children under 18.</p>
    <p>Users under 18 must have any parental or guardian involvement and authorization required by applicable law.</p>
    <p>Where we identify personal information processed in violation of applicable children&apos;s privacy requirements, we will take appropriate corrective measures.</p>

    <H id="links">13. Third-Party Links and Services</H>
    <p>The Superpi website may contain links to third-party services.</p>
    <p>We are not responsible for the privacy practices of independently operated third-party websites.</p>
    <p>Users should review the applicable policies of external services before providing their information.</p>

    <H id="changes">14. Changes to This Privacy Policy</H>
    <p>We may update this Privacy Policy to reflect changes in our Services, technology, operational practices, or legal requirements.</p>
    <p>Updated versions will be published at <a href={LEGAL.website} className="text-brand underline">{LEGAL.website}</a> with the revised effective date.</p>
    <p>Where required, we will notify users or request additional consent for material changes.</p>

    <H id="contact">15. Contact and Privacy Grievances</H>
    <p>For privacy questions, account deletion, personal data requests, or complaints, contact:</p>
    <div className="rounded-2xl border border-edge/60 bg-lavender/30 p-5 dark:bg-white/5">
      <p><b className="text-ink">Platform:</b> {LEGAL.product}</p><p><b className="text-ink">Company:</b> {LEGAL.company}</p>
      <p><b className="text-ink">Support &amp; Privacy Email:</b> <Mail to={LEGAL.support} /></p>
      <p><b className="text-ink">Registered Office:</b> {LEGAL.address}.</p><p><b className="text-ink">Website:</b> <a href={LEGAL.website} className="text-brand underline">{LEGAL.website}</a></p></div>
    <p>Privacy-related inquiries may be directed to the Company&apos;s support and privacy contact through the email address above.</p>

    <H id="law">16. Applicable Law</H>
    <p>This Privacy Policy is governed by applicable laws of India, including relevant provisions of the Information Technology Act, 2000, and applicable provisions of the Digital Personal Data Protection Act, 2023, and associated rules as they come into force.</p>
    <p>Nothing in this Privacy Policy limits rights or remedies that cannot legally be restricted.</p>
  </Legal>;
}
