import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button
} from "@mui/material";


const PrivacyNotice = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 600 }}>Privacy Notice</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          This Privacy Notice is issued by WellAI Sdn Bhd (“WellAI”) to regulate the collection and processing of your Personal Data (as herein defined) in strict accordance with the requirements of the Personal Data Protection Act, Malaysia, 2010 (PDPA).
          By interacting with us, submitting information to us, or signing up for any products and services offered by us, you agree and consent to WellAI, as well as its representatives and/or agents collecting, using, disclosing and sharing amongst themselves your Personal Data, and disclosing such Personal Data to our authorised service providers and relevant third parties in the manners set forth in this Privacy Notice.
          This Privacy Notice supplements but does not supersede nor replace any other consents you may have previously provided to WellAI in respect of your Personal Data, and your consents herein are additional to any rights which any member of WellAI may have at law to collect, use, or disclose your Personal Data.
          Please note that WellAI may amend this Privacy Notice at any time without prior notice and will notify you of any such amendment via our website or by email.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>1. Definitions</Typography>
        <Typography sx={{ mb: 3 }}>
          1.1. WellAI: Refers to WellAI Sdn Bhd, its affiliates, subsidiaries, associated entities, including but not limited to any of their branches and offices.
          1.2. Personal Data: Includes information such as name, age, gender, identity card number, passport number, date of birth, education, race, ethnic origin, nationality, contact details, family information, occupation details, medical and personal health information, demographic information, device information, device location, payment card number and expiry date, billing address, loyalty program membership details, photographs, video and audio, CCTV recordings and other images, preferences and interests, financial details, and any other information relevant to services provided.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 2 }}>2. Information Collection</Typography>
        <Typography sx={{ mb: 3 }}>
          2.1. We may collect Personal Data directly from you or from third parties, including but not limited to online forms, mobile applications, website, email, agreements, name cards, browser, files in media or storage, social medias, or any identity materials that you have distributed voluntarily.
          2.2. Information collected may include personal details, contact details, medical history, device information, and more. Providing obligatory information is necessary for the provision of services.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>3. Use of Information</Typography>
        <Typography sx={{ mb: 3 }}>
          3.1. The collected data may be used for various purposes including but not limited to processing medical services, administering services and events, processing payments, internal analysis, customer loyalty programmes, internal investigations, audit or security purposes, compliance with legal obligations, marketing and communication of relevant information.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>4. Disclosure of Information</Typography>
        <Typography sx={{ mb: 3 }}>
          4.1. Personal Data will be kept confidential but may be disclosed to relevant third parties, including other companies within the WellAI and relevant third parties (in or outside of Malaysia) as required under law, pursuant to the relevant contractual relationship or for purposes mentioned in paragraph 3 above.
          4.2. WellAI may also disclose or transfer Personal Data in the event of any restructuring, sale, or acquisition of the respective companies.
          4.3 Where WellAI deals with third parties, specific security and confidentiality safeguards will be put in place to ensure the personal data protection rights remain unaffected.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>5. Your Rights</Typography>
        <Typography sx={{ mb: 3 }}>
          5.1. You have the right to request access, correction, updating, or deletion of your Personal Data. Requests can be made through the designated contact points provided including but not limited to online registered account or request to pdpa@wellai.app.
          5.2. WellAI reserve the right to charge a fee for processing data access requests in accordance with PDPA.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>6. Withdrawing Consent</Typography>
        <Typography sx={{ mb: 3 }}>
          6.1. You are entitled to limit our processing of your personal data by expressly withdrawing in full, your consent given previously, in each case, including for direct marketing purposes subject to any applicable legal restrictions, contractual conditions, and within a reasonable amount of time period. You may opt out of receiving any communications from us at any time by:
          6.1.1 following the opt-out instructions or by clicking on the “unsubscribe link” contained in each marketing communication;
          6.1.2 editing the relevant account settings to unsubscribe; or
          6.1.3 sending a request to pdpa@wellai.app.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>7. Complaints</Typography>
        <Typography sx={{ mb: 3 }}>
          7.1. For any concerns or complaints regarding the use of Personal Data, you may contact the designated email address via pdpa@wellai.app.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>8. Children</Typography>
        <Typography sx={{ mb: 3 }}>
          8.1. Minors under the age of 18 may not use the respective websites or apps. WellAI does not knowingly collect personal information from anyone under the age of 18. No part of the website or application is designed to attract anyone under the age of 18. WellAI does not sell products and/or services for purchase by children. In certain instances, WellAI sells products and/or services for children but for purchase by adults.
          8.2 Links to Third Party Website
          Parts of our website may contain links to third party websites not owned by WellAI (“Third Party websites”). When you access a Third-Party website, please understand that we do not control the content of that Third Party website and are not responsible for the privacy practices or the content of that Third Party website. This Policy applies only to our site and you should be aware that other sites linked by this web site may have different privacy and personal data protection policies and we highly recommend that you read and understand the privacy statement of each site. We accept no responsibility or liability in respect of any such third-party materials or for the operation or content of other websites (whether or not linked to our website) which are not under WellAI's control.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>9. External Links</Typography>
        <Typography sx={{ mb: 3 }}>
          9.1. The websites or apps may contain links to third-party websites. WellAI is not responsible for the privacy practices or content of these external sites.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>10. Security Precautions</Typography>
        <Typography sx={{ mb: 3 }}>
          10.1. WellAI has stringent security measures in place to protect against unauthorized access, loss, misuse and alteration to Personal Data.
          10.2 A "Force Majeure Event" shall mean any event that is beyond the reasonable control and shall include, without limitation, sabotage, fire, flood, explosion, acts of God, civil commotion, strikes or industrial action of any kind, riots, insurrection, war, acts of government, computer hacking, unauthorised access to computer data and storage device, computer crashes, breach of security and encryption, etc.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>11. Changes to this Privacy Policy</Typography>
        <Typography sx={{ mb: 3 }}>
          11.1. WellAI reserves the right to update, change, or modify this Privacy Policy. Such changes will be effective from the date of the update. If You continue to use Your account and/or access the Website/App even after any such changes have been made, it would be deemed to be an implied consent to the changed policy.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>12. Cookies and Other Tracking Technologies</Typography>
        <Typography sx={{ mb: 3 }}>
          12.1. The websites or apps may use cookies and tracking technologies to collect information about user activity for analysis and customization of user experience. A "cookie" is a small text file that may be used, for example, to collect information about Site activity. Some cookies and other technologies may serve to recall Personal Information previously indicated by a Web user. Most browsers allow You to control cookies, including whether or not to accept them and how to remove them.
          12.2 Tracking technologies may record information such as Internet domain and host names; Internet protocol (IP) addresses; browser software and operating system types; stream patterns; and dates and times that our website or application is accessed. Our use of cookies and other tracking technologies allows WellAIs to improve our website, application and user experience. We may also analyze information that does not contain Personal Information for trends and statistics.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>13. Data Transfer and Sharing</Typography>
        <Typography sx={{ mb: 3 }}>
          13.1. Personal Data may be transferred to third parties, including within the respective group of companies or any third party service or product providers within or outside the country, for purposes of data storage, processing, and service provision.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>14. Indemnity</Typography>
        <Typography sx={{ mb: 3 }}>
          14.1. Users agree to indemnify WellAI against any disputes arising from the disclosure of Personal Information to third parties either through WellAI website or application or otherwise. We assume no liability for any actions of third parties with regard to the Personal Data, which you may have disclosed to such third parties.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>15. Severability</Typography>
        <Typography sx={{ mb: 3 }}>
          15.1. Each paragraph of this Privacy Policy is separate and independent. Nullification of one paragraph does not affect the other paragraphs herein except where otherwise expressly indicated or indicated by the context of the agreement.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>16. Contact Information</Typography>
        <Typography sx={{ mb: 3 }}>
          16.1. For any feedback or comments about this Privacy Policy, you may contact the designated email address via pdpa@wellai.app.
        </Typography>

        <Box sx={{ textAlign: "center" }}>
          <Button onClick={onClose}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyNotice;