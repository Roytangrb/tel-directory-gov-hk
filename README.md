# tel-directory-gov-hk
Tel Directory Data Of The HK Gov, [Source](https://tel.directory.gov.hk/)
(Data retrived on Fri Jul 13 2018)

## Parse the downloaded csv to json
* batchparse.js
  1. run on nodejs, require package of `readline`, `fs`, `stream`
  2. `cd path/to/the csv`
  3. mkdir JSON
  4. `node batchparse <filename> <filename> ...`
  Downloaded csv are in the format of `struct_<filename>.csv`, only pass the <filename> as bash command args, seperate args by a space
  5. results are written into JSON dir
  
* Json Structure
  ```const filename = {
    "name": [...],
    "head": [...],
    "inquiry": [...],
    "bureau": [...],
  }
  export default filename```
  
In some departments inquiry tel is not provided, the "bureau" array (full tel list of the department by bureau) will be paired up with key "inquiry" (since the inquiry section is omitted)
