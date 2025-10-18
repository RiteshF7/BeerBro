# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e6]: B
      - generic [ref=e7]: Welcome to BeerBro
      - generic [ref=e8]: Sign in to explore our collection of premium beverages
    - generic [ref=e9]:
      - button "Continue with Google" [ref=e10]:
        - img
        - text: Continue with Google
      - paragraph [ref=e12]:
        - text: By signing in, you agree to our
        - link "Terms of Service" [ref=e13] [cursor=pointer]:
          - /url: "#"
        - text: and
        - link "Privacy Policy" [ref=e14] [cursor=pointer]:
          - /url: "#"
  - region "Notifications alt+T"
  - alert [ref=e15]
  - iframe [ref=e16]:
    
  - generic [ref=e18]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - img [ref=e22]
        - generic [ref=e24]:
          - heading "Install BeerBro" [level=3] [ref=e25]
          - paragraph [ref=e26]: Get the app experience
      - button [ref=e27]:
        - img
    - generic [ref=e28]:
      - button "Install" [ref=e29]:
        - img
        - text: Install
      - button "Later" [ref=e30]
    - paragraph [ref=e31]: Install for offline access, push notifications, and a native app experience.
```