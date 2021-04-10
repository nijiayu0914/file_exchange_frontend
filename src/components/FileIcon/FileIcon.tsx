/**
 * @description: 文件Icon组件
 */
import React from "react";
import "./FileIcon.less"
import Icon from '@ant-design/icons';
import { ReactComponent as Ae } from "../../assets/fileicon/Ae.svg";
import { ReactComponent as Ai } from "../../assets/fileicon/Ai.svg";
import { ReactComponent as Apk } from "../../assets/fileicon/Apk.svg";
import { ReactComponent as AutoCAD } from "../../assets/fileicon/AutoCAD.svg";
import { ReactComponent as Avi } from "../../assets/fileicon/Avi.svg";
import { ReactComponent as AxureRP } from "../../assets/fileicon/AxureRP.svg";
import { ReactComponent as Bat } from "../../assets/fileicon/Bat.svg";
import { ReactComponent as Bmp } from "../../assets/fileicon/Bmp.svg";
import { ReactComponent as C } from "../../assets/fileicon/C.svg";
import { ReactComponent as Cpp } from "../../assets/fileicon/Cpp.svg";
import { ReactComponent as Css } from "../../assets/fileicon/Css.svg";
import { ReactComponent as Csv } from "../../assets/fileicon/Csv.svg";
import { ReactComponent as Dmg } from "../../assets/fileicon/Dmg.svg";
import { ReactComponent as Doc } from "../../assets/fileicon/Doc.svg";
import { ReactComponent as Docker } from "../../assets/fileicon/Docker.svg";
import { ReactComponent as Docx } from "../../assets/fileicon/Docx.svg";
import { ReactComponent as Exe } from "../../assets/fileicon/Exe.svg";
import { ReactComponent as File } from "../../assets/fileicon/File.svg";
import { ReactComponent as Flv } from "../../assets/fileicon/Flv.svg";
import { ReactComponent as Gis } from "../../assets/fileicon/Gis.svg";
import { ReactComponent as Gif } from "../../assets/fileicon/Gif.svg";
import { ReactComponent as Go } from "../../assets/fileicon/Go.svg";
import { ReactComponent as Html } from "../../assets/fileicon/Html.svg";
import { ReactComponent as Jpg } from "../../assets/fileicon/Jpg.svg";
import { ReactComponent as Ini } from "../../assets/fileicon/Ini.svg";
import { ReactComponent as Ipa } from "../../assets/fileicon/Ipa.svg";
import { ReactComponent as Ipynb } from "../../assets/fileicon/Ipynb.svg";
import { ReactComponent as Iso } from "../../assets/fileicon/Iso.svg";
import { ReactComponent as Java } from "../../assets/fileicon/Java.svg";
import { ReactComponent as Js } from "../../assets/fileicon/Js.svg";
import { ReactComponent as Json } from "../../assets/fileicon/Json.svg";
import { ReactComponent as Jsx } from "../../assets/fileicon/Jsx.svg";
import { ReactComponent as Less } from "../../assets/fileicon/Less.svg";
import { ReactComponent as Md } from "../../assets/fileicon/Md.svg";
import { ReactComponent as Mov } from "../../assets/fileicon/Mov.svg";
import { ReactComponent as Mp3 } from "../../assets/fileicon/Mp3.svg";
import { ReactComponent as Mp4 } from "../../assets/fileicon/Mp4.svg";
import { ReactComponent as Other } from "../../assets/fileicon/Other.svg";
import { ReactComponent as Pdf } from "../../assets/fileicon/Pdf.svg";
import { ReactComponent as Php } from "../../assets/fileicon/Php.svg";
import { ReactComponent as Png } from "../../assets/fileicon/Png.svg";
import { ReactComponent as Ppt } from "../../assets/fileicon/Ppt.svg";
import { ReactComponent as Pptx } from "../../assets/fileicon/Pptx.svg";
import { ReactComponent as Pr } from "../../assets/fileicon/Pr.svg";
import { ReactComponent as Ps } from "../../assets/fileicon/Ps.svg";
import { ReactComponent as Py } from "../../assets/fileicon/Py.svg";
import { ReactComponent as R } from "../../assets/fileicon/R.svg";
import { ReactComponent as Rar } from "../../assets/fileicon/Rar.svg";
import { ReactComponent as Rmvb } from "../../assets/fileicon/Rmvb.svg";
import { ReactComponent as Rsa } from "../../assets/fileicon/Rsa.svg";
import { ReactComponent as Ruby } from "../../assets/fileicon/Ruby.svg";
import { ReactComponent as Scss } from "../../assets/fileicon/Scss.svg";
import { ReactComponent as Sketch } from "../../assets/fileicon/Sketch.svg";
import { ReactComponent as Sql } from "../../assets/fileicon/Sql.svg";
import { ReactComponent as Svg } from "../../assets/fileicon/Svg.svg";
import { ReactComponent as Ts } from "../../assets/fileicon/Ts.svg";
import { ReactComponent as Tsx } from "../../assets/fileicon/Tsx.svg";
import { ReactComponent as Txt } from "../../assets/fileicon/Txt.svg";
import { ReactComponent as Vue } from "../../assets/fileicon/Vue.svg";
import { ReactComponent as Wmv } from "../../assets/fileicon/Wmv.svg";
import { ReactComponent as Xls } from "../../assets/fileicon/Xls.svg";
import { ReactComponent as Xlsx } from "../../assets/fileicon/Xlsx.svg";
import { ReactComponent as Xml } from "../../assets/fileicon/Xml.svg";
import { ReactComponent as Yaml } from "../../assets/fileicon/Yaml.svg";
import { ReactComponent as z7 } from "../../assets/fileicon/7z.svg";
import { ReactComponent as Zip } from "../../assets/fileicon/Zip.svg";


export const FileIcon: React.FC<any> = (props) => {
    const { fileType, size } = props
    const iconMap = {
        '': File,
        'ae': Ae,
        'ai': Ai,
        'apk': Apk,
        'dwg': AutoCAD,
        'avi': Avi,
        'bat': Bat,
        'bmp': Bmp,
        'c': C,
        'cpp': Cpp,
        'class': Java,
        'cpg': Gis,
        'css': Css,
        'csv': Csv,
        'dmg': Dmg,
        'doc': Doc,
        'dockerfile': Docker,
        'docx': Docx,
        'exe': Exe,
        'flv': Flv,
        'gif': Gif,
        'go': Go,
        'hpp': Cpp,
        'html': Html,
        'ini': Ini,
        'ipa': Ipa,
        'ipynb': Ipynb,
        'iso': Iso,
        'jar': Java,
        'java': Java,
        'jpg': Jpg,
        'jpeg': Jpg,
        'js': Js,
        'json': Json,
        'jsx': Jsx,
        'less': Less,
        'md': Md,
        'mov': Mov,
        'mp3': Mp3,
        'mp4': Mp4,
        'pdf': Pdf,
        'php': Php,
        'png': Png,
        'ppt': Ppt,
        'pptx': Pptx,
        'prj': Gis,
        'pr': Pr,
        'ps': Ps,
        'py': Py,
        'r': R,
        'rar': Rar,
        'rm': Rmvb,
        'rmvb': Rmvb,
        'rp': AxureRP,
        'ruby': Ruby,
        'rsa': Rsa,
        'sbn': Gis,
        'sbx': Gis,
        'shp': Gis,
        'sass': Scss,
        'scss': Scss,
        'sketch': Sketch,
        'sql': Sql,
        'svg': Svg,
        'ts': Ts,
        'tsx': Tsx,
        'txt': Txt,
        'vue': Vue,
        'wmv': Wmv,
        'xls': Xls,
        'xlsx': Xlsx,
        'xml': Xml,
        'yml': Yaml,
        'yaml': Yaml,
        '7z': z7,
        'zip': Zip,
    }
    return (
        <Icon component={iconMap[fileType] ? iconMap[fileType] : Other} style={{fontSize: size}}/>
    );
};

export default FileIcon;
