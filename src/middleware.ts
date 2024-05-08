import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "pt-br", "zh-cn"];
const publicPages = ["/login", "/forgotpassword", "/resetpassword", "/forgotpassword/api", "/resetpassword/api"];

const validateUser = (data: any) => {
  const user = data.req.cookies.get("session-info")?.value
    ? JSON.parse(data.req.cookies.get("session-info")?.value)
    : {};
  return user?.data?.accessToken ? true : false;
};

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
});
const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: (data) => {
        return validateUser(data);
      },
    },
    pages: {
      signIn: "/login",
      error: "/login",
      signOut: "/login",
    },
  },
);
export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(`^(/(${locales.join("|")}))?(${publicPages.join("|")})?/?$`, "i");

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  const match = req.nextUrl.pathname.match(publicPathnameRegex);
  if (validateUser({ req: req }) && match?.[3] == "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } else if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
