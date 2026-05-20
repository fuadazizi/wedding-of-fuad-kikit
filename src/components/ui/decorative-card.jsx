/**
 * Copyright (c) 2024-present mrofisr
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { cn } from "@/lib/utils";

/**
 * DecorativeCard component
 * Wraps content in a premium card container with a soft gradient background,
 * border styling, backdrop-blur, and elegant floral/leaf corner ornaments (❧).
 */
export default function DecorativeCard({ children, className, noOrnaments = false, ...props }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-rose-100/60 bg-gradient-to-b from-rose-50/60 to-white/80 backdrop-blur-sm px-6 py-8 shadow-sm",
        className
      )}
      {...props}
    >
      {/* Top Ornamental Corners */}
      {!noOrnaments && (
        <>
          <span className="absolute top-3 left-4 text-rose-200 text-2xl select-none pointer-events-none">
            ❧
          </span>
          <span
            className="absolute top-3 right-4 text-rose-200 text-2xl select-none pointer-events-none"
            style={{ transform: "scaleX(-1)" }}
          >
            ❧
          </span>
        </>
      )}

      {children}

      {/* Bottom Ornamental Corners */}
      {!noOrnaments && (
        <>
          <span
            className="absolute bottom-3 left-4 text-rose-200 text-2xl select-none pointer-events-none"
            style={{ transform: "rotate(180deg) scaleX(-1)" }}
          >
            ❧
          </span>
          <span
            className="absolute bottom-3 right-4 text-rose-200 text-2xl select-none pointer-events-none"
            style={{ transform: "rotate(180deg)" }}
          >
            ❧
          </span>
        </>
      )}
    </div>
  );
}
