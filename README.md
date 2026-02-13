what problems i faced and how i solved them.

1. Unsupported Provider error: "Google provider was not enabled in Supabase". Learning: i learned that at first i have to set the google auth in google console as well as in supabase sign-in/providers.

2. supabase signin/provider callback URl mismatched with auth redirect URIs in client Id for web app section in google cloud console. Learning: both should be same. there should not be any typos.

3. Once auser logs in it reloads and shows "Sign in with Google" again on screen. Learning: Session was not being checked on page load. i learned that supabase stores session in localStorage.

4. when adding any url and title and saving the bookmark was not appearing instantly. LEarning: added .insert().select().single() so that each time new row returns and state get upadted and shows in UI instantly.
