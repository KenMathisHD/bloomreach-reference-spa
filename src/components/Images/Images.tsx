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
import { Col, Image, Row } from 'react-bootstrap';
import { ImageSet, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import styles from './Images.module.scss';

const MAX_IMAGES = 4;

interface ImagesModels {
  image1?: Reference;
  image2?: Reference;
  image3?: Reference;
  image4?: Reference;
}

export function Images({ component, page }: BrProps): React.ReactElement | null {
  const models = component.getModels<ImagesModels>();
  const images = [...Array(MAX_IMAGES).keys()]
    .map((n) => `image${n + 1}` as keyof ImagesModels)
    .map((model) => models[model])
    .map((reference) => reference && page.getContent<ImageSet>(reference))
    .filter<ImageSet>(Boolean as any);

  if (!images.length) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <Row className="no-gutters mw-container mx-auto my-4">
      {images.map((image) => (
        <Col key={image.getId()} md={Math.max(12 / images.length, 6)} lg={Math.max(12 / images.length, 3)}>
          <div className={`${styles.images__container} position-relative h-0`}>
            <Image
              src={image.getOriginal()?.getUrl()}
              alt=""
              className={`${styles.images__image} position-absolute w-100 h-100`}
            />
          </div>
        </Col>
      ))}
    </Row>
  );
}
