/*
 * Copyright 2020-2021 Hippo B.V. (http://www.onehippo.com)
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
import { useRouteMatch } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { ContainerItem, Document, ImageSet } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrProps } from '@bloomreach/react-sdk';

import styles from './Content.module.scss';
import { ErrorPageContent } from './ErrorPageContent';

export function Content({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const document = page.getDocument<Document>();
  const match = useRouteMatch<{ path?: string }>('/:path');

  if (!document || component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  if (['404', '500'].includes(match?.params.path ?? '')) {
    return <ErrorPageContent document={document} page={page} />;
  }

  const { content, image: imageRef, title } = document.getData<ContentDocument>();
  const image = imageRef && page?.getContent<ImageSet>(imageRef)?.getOriginal();

  return (
    <article className={`${page.isPreview() ? 'has-edit-button' : ''} mw-container mx-auto`}>
      <BrManageContentButton content={document} />
      {title && <h1 className="mb-4">{title}</h1>}
      {image && (
        <div className={`${styles['content__image-container']} mb-4`}>
          <Image className={`${styles.content__image} d-block w-100 h-100`} src={image.getUrl()} alt={title} />
        </div>
      )}
      {content?.value && (
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: page?.rewriteLinks(content.value) ?? '' }} />
      )}
    </article>
  );
}
