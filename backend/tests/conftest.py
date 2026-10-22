import os
import tempfile

os.environ["BAYYINAH_DB"] = os.path.join(tempfile.mkdtemp(), "test.db")
