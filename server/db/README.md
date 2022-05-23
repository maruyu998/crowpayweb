# DB Structure

## User
- username: str # unique
- passhash: str # hashed password
<!-- - groups: list
    - id
    - amount: int # 残高 -->

<!-- ## Group
- id
- groupname: str
- members: list
    - username
    - accepted: boolean -->

## Transaction
- id
- issuer # 取引起票者
- issued_at # 起票日時
- acceptor # 取引受任者
- accepted_at # 受任日時
- sender # 支払い者
- receiver # 受け取り者
- amount # 取引金額(正)
- contents # 取引内容
<!-- - groupid # グループ単位 -->

## Friend # 今のところ相互に登録し合う
- username
- friendname
- accepted