# Product Principles

These principles define the long-term direction of Chessome and influence all architectural and implementation decisions.

## Open-Source First

Chessome is an open-source platform.

Prefer integrating mature, actively maintained open-source projects instead of rebuilding solved problems.

When evaluating dependencies:
* Prefer projects with healthy maintenance, active communities, and long-term stability.
* Respect and comply with all software licenses.
* Where compatible with Chessome's goals, it is acceptable to adopt strong copyleft software (e.g. GPL/LGPL) or other well-established open-source licenses if they materially improve the platform.
* Every third-party dependency must be documented, attributed where required, and periodically reviewed for maintenance and security.

Do not reinvent mature infrastructure unless there is a compelling architectural or product reason.

## Engine Strategy

Chessome aims to provide world-class chess analysis.

Use the strongest stable, actively maintained analysis engines available.
* "Chessome always targets the strongest stable engine versions that have passed the project's qualification suite."

The engine layer must be designed so engines can be upgraded or replaced without affecting the rest of the architecture.
Support future coexistence of multiple engines (e.g., Stockfish, Berserk, Koivisto, Ethereal, and future engines) through the existing plugin architecture.
Do not hardcode behavior around a single engine.
When a new stable engine release provides meaningful improvements, the plugin system should allow qualification and adoption with minimal changes.

## UI / UX Philosophy

The user experience must remain:
* Simple
* Fast
* Clean
* Consistent
* Accessible

Do not over-engineer interfaces.
Do not add animations, interactions, or visual effects unless they improve usability.

Every screen should prioritize:
* Clarity over decoration
* Responsiveness over complexity
* Discoverability over hidden functionality

**Progressive Disclosure:**
* Beginners should immediately understand the interface.
* Advanced users should have powerful controls available without cluttering the default experience.

Every new UI element must answer one question:
*"Does this make analysis easier to understand or faster to use?"*
If the answer is no, it should not be added.

Chessome should feel premium because of thoughtful design, speed, and polish—not because of excessive visual effects or unnecessary complexity.

## Long-Term Goal

Every architectural and product decision should move Chessome toward becoming the leading open-source chess analysis platform.

When multiple implementation options exist, prefer the one that:
* Improves analysis quality
* Improves user understanding
* Improves maintainability
* Improves long-term scalability
* Reduces unnecessary complexity
* Leverages proven open-source software where appropriate
