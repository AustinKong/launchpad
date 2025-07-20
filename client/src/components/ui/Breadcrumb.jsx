import { Breadcrumb as ChakraBreadcrumb } from "@chakra-ui/react";
import { safeDecodeURIComponent, slugToText, toTitleCase } from "@launchpad/shared";
import { Fragment } from "react";
import { Link, useLocation } from "react-router";

export default function Breadcrumb({ separator, ...rest }) {
  const { pathname } = useLocation();
  const pathParts = pathname.split("/").filter(Boolean);
  const pathLinks = pathParts.map((part, index) => {
    const to = `/${pathParts.slice(0, index + 1).join("/")}`;
    const label = toTitleCase(slugToText(safeDecodeURIComponent(part)));
    return { label, to };
  });
  pathLinks.unshift({ label: "Home", to: "/" });

  return (
    <ChakraBreadcrumb.Root {...rest}>
      <ChakraBreadcrumb.List>
        {pathLinks.map((item, index) => {
          const isLast = index === pathLinks.length - 1;
          return (
            <Fragment key={index}>
              <ChakraBreadcrumb.Item>
                {isLast ? (
                  <ChakraBreadcrumb.CurrentLink>{item.label}</ChakraBreadcrumb.CurrentLink>
                ) : (
                  <ChakraBreadcrumb.Link asChild>
                    <Link to={item.to}>{item.label}</Link>
                  </ChakraBreadcrumb.Link>
                )}
              </ChakraBreadcrumb.Item>
              {separator && !isLast && (
                <ChakraBreadcrumb.Separator>{separator}</ChakraBreadcrumb.Separator>
              )}
            </Fragment>
          );
        })}
      </ChakraBreadcrumb.List>
    </ChakraBreadcrumb.Root>
  );
}
