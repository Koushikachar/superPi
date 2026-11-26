import { pageMeta } from "@/lib/seo"; import Legal, { H, UL, OL, DT, Mail } from "@/components/Legal"; import { LEGAL } from "@/lib/legal";
export const metadata = pageMeta({ title: "Terms & conditions", description: "The terms for using Superpi, operated by Direct2Hub Private Limited: accounts, the Free Forever plan, your data, the Business AI Assistant, acceptable use and liability.", path: "/terms" });
const TOC: [string, string][] = [["acceptance", "1. Acceptance"], ["services", "2. Our services"], ["account", "3. Account registration"], ["free", "4. Free Forever plan"], ["paid", "5. Future paid services"], ["data", "6. User data"], ["ai", "7. Business AI Assistant"], ["use", "8. Acceptable use"], ["ip", "9. Intellectual property"], ["availability", "10. Availability"], ["backup", "11. Accuracy & backups"], ["third", "12. Third-party services"], ["privacy", "13. Privacy"], ["termination", "14. Suspension"], ["warranty", "15. Warranties"], ["liability", "16. Liability"], ["changes", "17. Changes"], ["law", "18. Governing law"], ["contact", "19. Contact"]];
export default function Terms() {
  return <Legal title="Terms & conditions" path="/terms" toc={TOC}>
    <H id="acceptance">1. Acceptance of Terms</H>
    <p>Welcome to Superpi.</p>
    <p>These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of Superpi, including its website, inventory management software, Business AI Assistant, and related services.</p>
    <p>Superpi is founded and operated by {LEGAL.company}, an Indian company registered under the Companies Act, 2013.</p>
    <p>By creating an account, accepting these Terms, or using the Services, you agree to comply with these Terms and acknowledge our Privacy Policy.</p>
    <p>If you do not agree, you must not use the Services.</p>
    <p>If you use Superpi on behalf of a business or organization, you confirm that you have the authority to accept these Terms on its behalf.</p>

    <H id="services">2. About Our Services</H>
    <p>Superpi is a cloud-based inventory management platform designed to assist users with managing products, stock records, and related business information.</p>
    <p>Our current services include:</p>
    <DT t="Inventory Management">Tools to organize products, maintain inventory information, and manage stock-related records.</DT>
    <DT t="Business AI Assistant">An AI-powered feature that uses relevant information available within your account to help answer questions and explain business data.</DT>
    <p>The functionality available to users may depend on their plan, account configuration, and the current version of the software.</p>
    <p>We may update, improve, or modify features to maintain or develop the Services, subject to applicable law and contractual commitments.</p>

    <H id="account">3. Account Registration</H>
    <p>Users may create an account using:</p>
    <UL items={["Email and password", "Google sign-in"]} />
    <p>You agree to provide accurate information during registration and maintain the security of your account.</p>
    <p>You must not impersonate another person, create accounts for fraudulent purposes, or access another user&apos;s account without authorization.</p>
    <p>You are responsible for activity carried out through your account to the extent permitted by applicable law.</p>
    <p>Please report suspected unauthorized access to <Mail to={LEGAL.support} />.</p>

    <H id="free">4. Free Forever Plan</H>
    <p>Superpi offers a Free Forever plan supporting up to 100 products.</p>
    <p>The plan is available without a recurring subscription fee for its included features, subject to the published plan specifications and applicable usage restrictions.</p>
    <p>The Free Forever plan may include reasonable technical or fair-use limitations necessary to maintain platform security and availability, provided such restrictions are appropriately disclosed.</p>
    <p>&quot;Free Forever&quot; does not guarantee that every feature, technical specification, or usage limit will remain unchanged indefinitely.</p>
    <p>We may introduce improvements or make changes to the plan in accordance with applicable law and commitments made to existing users.</p>
    <p>Superpi currently does not offer active paid subscriptions.</p>

    <H id="paid">5. Future Paid Services</H>
    <p>Additional premium features or subscription plans may be introduced in the future.</p>
    <p>If paid services become available, the applicable pricing, billing frequency, taxes, renewal conditions, cancellation procedures, and refund terms will be disclosed before purchase.</p>
    <p>Users of the Free Forever plan will not automatically be charged or enrolled in paid subscriptions without an applicable authorization.</p>
    <p>Future paid services may be governed by additional terms communicated at the time of purchase.</p>

    <H id="data">6. User Data and Inventory Records</H>
    <p>Users may enter, upload, edit, or manage inventory and related business information within Superpi.</p>
    <p>Users retain their rights in the data they provide.</p>
    <p>By submitting data, users authorize Superpi to store, process, display, and otherwise use it as reasonably necessary to provide the requested Services and for other purposes permitted under our Privacy Policy and applicable law.</p>
    <p>Users are responsible for:</p>
    <UL items={["Providing accurate inventory information.", "Ensuring they are authorized to use submitted information.", "Maintaining appropriate inventory records.", "Reviewing stock changes and business reports.", "Maintaining independent backups of important information.", "Complying with applicable laws governing their business."]} />
    <p>Superpi does not independently verify every product record, stock quantity, price, or business entry.</p>

    <H id="ai">7. Business AI Assistant</H>
    <p>Superpi&apos;s Business AI Assistant uses relevant inventory and dashboard information available within a user&apos;s account to provide AI-generated assistance.</p>
    <p>The feature operates with the support of an external AI technology provider.</p>
    <p>Users acknowledge that:</p>
    <OL items={["AI-generated answers may contain errors or inaccuracies.", "Responses may depend on the completeness and accuracy of available business data.", "AI-generated information should be independently reviewed before important business decisions.", "The assistant does not guarantee revenue growth, profitability, or specific business results.", "AI responses should not replace professional legal, accounting, tax, or financial advice."]} />
    <p>Users must not rely exclusively on AI-generated outputs for critical decisions.</p>
    <p>The Business AI Assistant is provided as a business-support tool and not as a substitute for independent professional judgment.</p>

    <H id="use">8. Acceptable Use</H>
    <p>Users agree not to:</p>
    <UL items={["Use Superpi for unlawful or fraudulent purposes.", "Attempt to gain unauthorized access to accounts or systems.", "Upload viruses, malware, or other harmful software.", "Circumvent security or authentication measures.", "Disrupt or overload the Services.", "Upload information that infringes third-party rights.", "Attempt to reverse-engineer protected software except where permitted by law.", "Misuse the Business AI Assistant to violate applicable law.", "Misrepresent their identity or business authorization."]} />
    <p>We may take appropriate measures to prevent or investigate misuse, including restricting or suspending access where reasonably necessary.</p>

    <H id="ip">9. Intellectual Property</H>
    <p>The Superpi brand, name, logo, website design, application interface, software, and associated proprietary materials are owned by or licensed to {LEGAL.company}.</p>
    <p>Users receive a limited, non-exclusive, non-transferable right to access and use the Services in accordance with these Terms.</p>
    <p>Users may not copy, redistribute, commercially exploit, or reproduce protected platform materials without appropriate permission.</p>
    <p>Nothing in these Terms transfers ownership of a user&apos;s underlying inventory or business records to {LEGAL.company}.</p>

    <H id="availability">10. Platform Availability</H>
    <p>We aim to provide a reliable and accessible software platform.</p>
    <p>However, temporary interruptions may occur due to maintenance, updates, technical failures, network issues, security events, or circumstances outside our reasonable control.</p>
    <p>We do not guarantee uninterrupted or error-free availability.</p>
    <p>Where reasonably practicable, we may provide notices about significant planned maintenance or service changes.</p>

    <H id="backup">11. Data Accuracy and Backup Responsibility</H>
    <p>The accuracy of inventory information depends partly on the information provided and maintained by users.</p>
    <p>Users should regularly verify inventory records and preserve independent copies of important business data.</p>
    <p>Superpi does not guarantee that its use will eliminate all inventory discrepancies, prevent every operational error, or protect against every possible data loss event.</p>

    <H id="third">12. Third-Party Services</H>
    <p>Superpi may rely on external providers for infrastructure, authentication, artificial intelligence, and other technical functionality.</p>
    <p>These third-party systems may be subject to their own terms, policies, and availability limitations.</p>
    <p>We are not responsible for independently operated third-party services except to the extent required by applicable law or our contractual obligations.</p>

    <H id="privacy">13. Privacy</H>
    <p>Our handling of personal information is described in the Superpi <a href="/privacy" className="text-brand underline">Privacy Policy</a> available through <a href={LEGAL.website} className="text-brand underline">{LEGAL.website}</a>.</p>
    <p>We process user information in accordance with applicable privacy requirements and the purposes disclosed in that policy.</p>

    <H id="termination">14. Suspension and Termination</H>
    <p>We may suspend, restrict, or terminate access where reasonably necessary due to:</p>
    <UL items={["Material violation of these Terms", "Fraudulent or unlawful activity", "Threats to platform security", "Unauthorized account access", "Abuse of platform resources", "Applicable legal requirements"]} />
    <p>Where appropriate and legally permitted, we may provide notice or an opportunity to resolve the issue.</p>
    <p>Users may discontinue using Superpi and request account deletion by contacting <Mail to={LEGAL.support} />.</p>
    <p>Account termination may result in loss of access to the Services and associated information, subject to applicable data retention obligations.</p>

    <H id="warranty">15. Disclaimer of Warranties</H>
    <p>Superpi is provided on an &quot;as available&quot; basis, to the maximum extent permitted by applicable law.</p>
    <p>We do not guarantee that:</p>
    <UL items={["The platform will always be uninterrupted or error-free.", "All inventory records will be accurate.", "AI-generated outputs will always be complete or correct.", "The Services will meet every user's individual requirements.", "Using Superpi will generate specific commercial or financial results."]} />
    <p>Nothing in these Terms excludes statutory warranties or rights that cannot legally be excluded.</p>

    <H id="liability">16. Limitation of Liability</H>
    <p>To the maximum extent permitted by applicable law, {LEGAL.company} shall not be liable for indirect, incidental, special, or consequential losses arising from the use of Superpi, including lost business opportunities, lost profits, or operational disruption, except where such liability cannot lawfully be excluded.</p>
    <p>This limitation does not exclude liability arising from fraud, wilful misconduct, or other matters for which liability cannot legally be restricted.</p>
    <p>Users remain responsible for independently reviewing business-critical decisions and information.</p>

    <H id="changes">17. Changes to the Services and Terms</H>
    <p>We may update these Terms and modify our Services to reflect changes in technology, features, operations, security requirements, or applicable laws.</p>
    <p>Updated Terms will be published on our website with the relevant effective date.</p>
    <p>Where required by law, we will provide additional notice or obtain consent before material changes take effect.</p>

    <H id="law">18. Governing Law and Dispute Resolution</H>
    <p>These Terms are governed by the laws of India.</p>
    <p>Users are encouraged to contact our support team first regarding any dispute or concern.</p>
    <p>Subject to mandatory legal rights and applicable law, disputes will be subject to the jurisdiction of competent courts in Karnataka, India.</p>
    <p>Nothing in these Terms restricts rights to approach an appropriate statutory or consumer dispute redressal authority.</p>

    <H id="contact">19. Contact Information</H>
    <p>For questions about these Terms, contact:</p>
    <div className="rounded-2xl border border-edge/60 bg-lavender/30 p-5 dark:bg-white/5">
      <p><b className="text-ink">Company:</b> {LEGAL.company}</p><p><b className="text-ink">Product:</b> {LEGAL.product}</p><p><b className="text-ink">CIN:</b> {LEGAL.cin}</p>
      <p><b className="text-ink">General Email:</b> <Mail to={LEGAL.email} /></p><p><b className="text-ink">Support Email:</b> <Mail to={LEGAL.support} /></p>
      <p><b className="text-ink">Registered Office:</b> {LEGAL.address}.</p><p><b className="text-ink">Website:</b> <a href={LEGAL.website} className="text-brand underline">{LEGAL.website}</a></p></div>
  </Legal>;
}
