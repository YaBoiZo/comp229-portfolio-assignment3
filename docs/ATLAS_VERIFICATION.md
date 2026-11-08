# Atlas connection verification

Verified on November 7, 2026 (America/Toronto).

- Cluster0 resumed and reachable from the approved current IP.
- The application uses the separate PortfolioLab3 database.
- Seeded one administrator, three projects, and two qualifications.
- Frontend proxy successfully reads projects and qualifications and authenticates the administrator.
- Contact creation, update, and deletion through the frontend proxy were independently confirmed directly in Atlas.
- The temporary verification contact was removed.
- Credentials remain in ignored local configuration files and are excluded from the source ZIP and GitHub.

## Hosted verification

Verified November 8, 2026 at https://zohaib-syed-comp229-lab3.onrender.com. Render connected successfully after its two Ohio outbound ranges were added to the Atlas access list. The application serves the frontend and API together over HTTPS.

- Health endpoint and database reads succeeded with three projects and two qualifications.
- Admin signin returned a Secure, HTTP-only session cookie.
- Hosted contact creation, reading, updating, and deletion succeeded.
- Signup ignored a requested admin role and created a regular user.
- Regular users received HTTP 403 for project creation and private contact access.
- Signout invalidated the previous token with HTTP 401.
- Temporary contact and member records were removed.
