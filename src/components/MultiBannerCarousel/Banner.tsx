/*
 * Copyright 2020 Hippo B.V. (http://www.onehippo.com)
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

import React from 'react';
import { Image } from 'react-bootstrap';
import { Document, ImageSet } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrPageContext } from '@bloomreach/react-sdk';

import { Link } from '../Link';
import styles from './Banner.module.scss';

interface BannerProps extends React.ComponentPropsWithoutRef<'a'> {
  document: Document;
  parameterName?: string;
}

export const Banner = React.forwardRef(
  ({ document, parameterName, className, ...props }: BannerProps, ref: React.Ref<HTMLAnchorElement>) => {
    const page = React.useContext(BrPageContext);

    const { image: imageRef, link: linkRef, title } = document.getData<BannerDocument>();
    const link = linkRef && page?.getContent<Document>(linkRef);
    const image = imageRef && page?.getContent<ImageSet>(imageRef)?.getOriginal();

    return (
      <Link
        ref={ref}
        href={link?.getUrl()}
        className={`${styles.banner} ${page?.isPreview() ? 'has-edit-button' : ''} ${className ?? ''}`}
        {...props}
      >
        <BrManageContentButton
          content={document}
          documentTemplateQuery="new-banner-document"
          folderTemplateQuery="new-banner-folder"
          parameter={parameterName ?? 'document'}
          root="brxsaas/banners"
          relative
        />

        {image && <Image className={`${styles.banner__image} d-block w-100 h-100`} src={image.getUrl()} alt={title} />}
      </Link>
    );
  },
);
