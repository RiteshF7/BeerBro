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
        - link "Terms of Service" [ref=e13]:
          - /url: "#"
        - text: and
        - link "Privacy Policy" [ref=e14]:
          - /url: "#"
  - region "Notifications alt+T"
  - iframe [ref=e15]:
    
  - alert [ref=e16]
```