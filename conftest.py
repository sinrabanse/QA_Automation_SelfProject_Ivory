import pytest

@pytest.fixture()
def testing_process():
    print("Start test")
    yield
    print("Finish test")