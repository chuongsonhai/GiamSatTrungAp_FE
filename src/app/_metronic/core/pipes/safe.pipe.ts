// Angular
import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
  SafeValue,
} from '@angular/platform-browser';

/**
 * Enum đại diện cho các kiểu nội dung an toàn.
 */
export enum SafeType {
  HTML = 'html',
  STYLE = 'style',
  SCRIPT = 'script',
  URL = 'url',
  RESOURCE_URL = 'resourceUrl',
}

/**
 * Pipe xử lý nội dung an toàn cho Angular DOM.
 * CHỈ sử dụng nếu bạn CHẮC CHẮN giá trị là an toàn.
 */
@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  /**
   * Chuyển đổi giá trị sang dạng an toàn phù hợp.
   * @param value Dữ liệu đầu vào (HTML, URL, v.v.)
   * @param type Kiểu nội dung (phải là một giá trị trong enum SafeType)
   * @returns SafeValue dùng được trong DOM Angular
   */
  transform(
    value: string,
    type: SafeType
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    if (!value) {
      throw new Error('Giá trị truyền vào pipe "safe" không được rỗng.');
    }

    switch (type) {
      case SafeType.HTML:
        return this._sanitizer.bypassSecurityTrustHtml(value);
      case SafeType.STYLE:
        return this._sanitizer.bypassSecurityTrustStyle(value);
      case SafeType.SCRIPT:
        return this._sanitizer.bypassSecurityTrustScript(value);
      case SafeType.URL:
        return this._sanitizer.bypassSecurityTrustUrl(value);
      case SafeType.RESOURCE_URL:
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Loại nội dung không được hỗ trợ trong pipe "safe": ${type}`);
    }
  }
}
