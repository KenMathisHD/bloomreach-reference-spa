/*
 * Copyright 2020-2023 Bloomreach
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { Image } from "react-bootstrap";
import { BrPageContext } from "@bloomreach/react-sdk";

import { Link } from "../Link";

import styles from "./Banner.module.scss";

interface BannerProps extends React.ComponentPropsWithoutRef<"a"> {
  document: BannerDocument;
}

export const Banner = React.forwardRef(
  (
    { document, className, ...props }: BannerProps,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    const page = React.useContext(BrPageContext);

    const { imageMobile, imageDesktop, imageAlt, link }: any = document;

    return (
      <a
        href={link}
        className={`${styles.banner} ${
          page?.isPreview() ? "has-edit-button" : ""
        } ${className ?? ""}`}
        {...props}
      >
        <picture>
          {imageDesktop && (
            <source media="(min-width: 768px)" srcSet={imageDesktop} />
          )}
          {imageMobile && (
            <img
              className={`${styles.banner__image} d-block w-100 h-100`}
              src={imageMobile}
              alt={imageAlt}
            />
          )}
        </picture>
      </a>
    );
  }
);
