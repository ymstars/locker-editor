# locker-editor

## 1.系统要求 (System requirement)

* `nodejs v10.20.1+`
* `npm 6.x` or `yarn 1.20+`
* `node-gyp`  https://github.com/nodejs/node-gyp/

## 2. 安装 (Install & Run)

*  使用`Git`客户端将仓库克隆到本地目录，`git clone https://github.com/ymstars/lock-editor.git`
* `cd locker-editor`
*  确保 `/data/files`和`/data/db` 目录是可写的
* `npm install`
* `npm run start`
* Visit the web page `http://localhost:8080`

## 3. 配置

如果需要变更配置，请编辑 `src/config/global.js`文件，包含如下配置：

```javascript
const DATABASE_FILE = 'data/db/ring.db'; //数据库文件路径
const TABLE_NAME = 'editor_files'; //表名
const FILE_BASE_PATH = 'data/files'; //文本文件存储目录
const FILE_TYPE = '.txt'; //文件后缀
```

## 4. 说明

本系统包含以下功能：

* 文件浏览 （View File List），`url` 为`/view`   ，本页面列出了所有的文件，列表信息中`Status`和`Action`会实时变化，当有新文件被添加时也会动态更新列表
* 文件新建 （Create New File），`url` 为 `/` ，本页面可以新增文件，需要填充不包含后缀的文件名称`file name` 和 初始内容 `content`
* 文件锁定编辑 （Edit FIle），`url` 为 `/edit/:id`，本页面需要携带 `query`参数 `sign`作为文件锁定者校验，顶部会提示编辑倒计时，每位编辑者有60秒的时间编辑，如果超时系统会主动释放文件锁定，并回到文件浏览页面